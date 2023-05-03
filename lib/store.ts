import { create } from "zustand";

export interface StoreState {
  showMenu: boolean
  showIntroLoading: boolean
  showIntro: boolean
  setShowMenu: (showMenu: boolean) => void
  setShowIntro: (showIntro: boolean) => void
  setShowIntroLoading: (showIntro: boolean) => void

}

const useStore = create<StoreState>((set) => ({
  showMenu: false,
  showIntro: true,
  showIntroLoading: true,
  setShowMenu: (showMenu: boolean) =>
    set((state) => ({
      showMenu
    })
    ),
  setShowIntro: (showIntro: boolean) =>
    set((state) => ({
      showIntro
    })
    ),
  setShowIntroLoading: (showIntroLoading: boolean) =>
    set((state) => ({
      showIntroLoading
    })
    ),
}));

export default useStore;
