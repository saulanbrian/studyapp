import { useFocusEffect } from "@react-navigation/native"
import { AudioPlayer, useAudioPlayer } from "expo-audio"
import React, { createContext, useCallback, useContext, useMemo } from "react"


const countDownTickSource = require("@/assets/sounds/countdown-tick.mp3")
const quizBackgroundMusicSource = require("@/assets/sounds/quiz-background-music.mp3")
const quiAnswerClickSoundSource = require("@/assets/sounds/quiz-answer-click-sound.mp3")

type SoundName =
  | "countdownTick"
  | "quizBackgroundMusic"
  | "quizAnswerClickSound"

type SoundType = {
  play: () => void;
  stop: () => void;
}

type QuizSoundContextType = {
  countdownTick: SoundType;
  quizBackgroundMusic: SoundType;
  quizAnswerClickSound: SoundType;
}

const QuizSoundContext = createContext<
  QuizSoundContextType | null
>(null)


export const useQuizSound = () => {
  const context = useContext(QuizSoundContext)
  if (!context) {
    throw new Error(`
      Couldnt use quizSound outside QuizSoundProvider
    `)
  }
  return context
}


export default function QuizSoundContextProvider({
  children
}: {
  children: React.ReactNode
}) {

  const countDownTick = useAudioPlayer(countDownTickSource)
  const quizBackgroundMusic = useAudioPlayer(quizBackgroundMusicSource)
  const quizAnswerClickSound = useAudioPlayer(quiAnswerClickSoundSource)

  const play = useCallback((soundName: SoundName) => {
    let sound;

    switch (soundName) {
      case "countdownTick":
        sound = countDownTick;
        break;
      case "quizBackgroundMusic":
        sound = quizBackgroundMusic;
        sound.loop = true
        break;
      case "quizAnswerClickSound":
        sound = quizAnswerClickSound;
        break;
    }

    sound?.seekTo(0)
    sound?.play()
  }, [countDownTick, quizBackgroundMusic, quizAnswerClickSound])

  const stop = useCallback((soundName: SoundName) => {
    let sound;

    switch (soundName) {
      case "countdownTick":
        sound = countDownTick;
        break;
      case "quizBackgroundMusic":
        sound = quizBackgroundMusic;
        break;
      case "quizAnswerClickSound":
        sound = quizAnswerClickSound;
        break;
    }

    sound.pause()
    sound.seekTo(0)

  }, [countDownTick, quizBackgroundMusic])

  const value = useMemo<QuizSoundContextType>(() => ({
    countdownTick: {
      play: () => play("countdownTick"),
      stop: () => stop("countdownTick")
    },
    quizBackgroundMusic: {
      play: () => play("quizBackgroundMusic"),
      stop: () => stop("quizBackgroundMusic")
    },
    quizAnswerClickSound: {
      play: () => play("quizAnswerClickSound"),
      stop: () => play("quizAnswerClickSound")
    }
  }), [countDownTick, quizBackgroundMusic])

  return (
    <QuizSoundContext.Provider value={value}>
      {children}
    </QuizSoundContext.Provider>
  )
}
