import { View, Text,
  Dimensions,
  Image,
  Pressable,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { images } from "@/constants/images";
import { useAuthStore } from "@/utils/authStore";
import Animated, {
  FadeIn,
  FadeInUp,
  ReduceMotion,
  useSharedValue,
} from "react-native-reanimated";

import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

const onboarding = () => {

  const {loggedin, onboarding, onboardingComplete} = useAuthStore();


  const colorScheme = useColorScheme();

  const data = [images.onboarding1, images.onboarding2, images.onboarding3];
  const dataTitle = [
    "No more empty promises.",
    "Stay accountable, stay motivated.",
    "Crushed your goal?",
  ];
  const dataSubtitle = [
    "Lock in your habit with a contract and commit for real.",
    "Log your progress and keep your streak alive.",
    "Celebrate your win or double down and push further.",
  ];
  const width = 1.2 * Dimensions.get("window").width;

  const [title, setTitle] = useState(dataTitle[0]);
  const [subtitle, setSubtitle] = useState(dataSubtitle[0]);

  const scrollOffsetValue = useSharedValue<number>(0);

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const [onboardCompleted, setOnboardComplete] = useState(false);

  const onPressPagination = (index: number) => {
    if (index > 2) {
      setOnboardComplete(true);
      return;
    } else {
      ref.current?.scrollTo({
        // Calculates the difference between the current index and the target indexto ensure that the carousel scrolls
        count: index - progress.value,
        animated: true,
      });
      setTitle(dataTitle[index]);
      setSubtitle(dataSubtitle[index]);
      if (index === 2) {
        setOnboardComplete(true);
      }
    }
  };

  const onboardMainFlow = () => {
    onboardingComplete()
  }

  return (
    <ThemedView className="h-full items-center">
      <View className="justify-center items-center flex">
        <Carousel
          ref={ref}
          width={width}
          height={width}
          data={data}
          onProgressChange={progress}
          loop={false}
          enabled={false}
          renderItem={({ index }) => (
            <Animated.View
              key={index}
              entering={FadeIn.duration(1000)
                .delay(200)
                .reduceMotion(ReduceMotion.Never)}
            >
              {/* <Text style={{ textAlign: "center", fontSize: 30 }}>{index}</Text> */}
              <Image
                source={data[index]}
                resizeMode="contain"
                className={
                  index === 2
                    ? "w-[80%] h-[90%] justify-center self-center mt-[32px]"
                    : "w-full h-full"
                }
              />
            </Animated.View>
          )}
        />

        <Animated.View
          entering={FadeIn.duration(1000)
            .delay(500)
            .reduceMotion(ReduceMotion.Never)}
        >
          <Pagination.Basic<{ color: string }>
            progress={progress}
            data={data}
            size={12}
            dotStyle={{
              borderRadius: 100,
              backgroundColor: "#262626",
            }}
            activeDotStyle={{
              borderRadius: 100,
              overflow: "hidden",
              backgroundColor: "#0088FF",
            }}
            containerStyle={[
              {
                gap: 5,
                marginBottom: 10,
              },
            ]}
            horizontal
            onPress={() => {}}
          />
        </Animated.View>
      </View>

      <View className="items-center mt-[30px]">
        <Animated.View
          key={title}
          entering={FadeInUp.duration(800)
            .delay(progress.value !== 0 ? 200 : 1200)
            .reduceMotion(ReduceMotion.Never)}
        >
          <ThemedText type="title" className="text-center">
            {title}
          </ThemedText>
        </Animated.View>

        <Animated.View
          key={subtitle}
          entering={FadeInUp.duration(800)
            .delay(progress.value !== 0 ? 400 : 1600)
            .reduceMotion(ReduceMotion.Never)}
        >
          <ThemedText type="subtitle" className="text-center mt-4 mx-[50px]">
            {subtitle}
          </ThemedText>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeIn.duration(800)
          .delay(2400) // delay before buttons appear
          .reduceMotion(ReduceMotion.Never)}
        className="absolute bottom-[80px] flex flex-row justify-center items-center gap-8 w-[80%]"
      >
        <Animated.View
          entering={FadeIn.duration(800)
            .delay(2600) // skip button animates first
            .reduceMotion(ReduceMotion.Never)}
          className="flex-1"
        >
            <Pressable
              className="mt-[120px] bg-[#262626] p-4 rounded-lg items-center w-full"
              onPress={() => {onboardMainFlow()}}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <ThemedText type="onboarding" lightColor="white">
                Skip
              </ThemedText>
            </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(800)
            .delay(2700) // next button animates after skip
            .reduceMotion(ReduceMotion.Never)}
          className="flex-1"
        >
          <Pressable
            className="mt-[120px] bg-[#0088FF] p-4 rounded-lg items-center w-full"
            onPress={() => {
              if (!onboardCompleted) {
                onPressPagination(progress.value + 1);
              } else {
                onboardMainFlow()
              }
            }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <ThemedText type="onboarding" lightColor="white">
              Next
            </ThemedText>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </ThemedView>
  );
};

export default onboarding;
