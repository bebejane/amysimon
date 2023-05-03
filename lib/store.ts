import create from "zustand";

export interface StoreState {
  showMenu: boolean
  showIntro: boolean
  setShowMenu: (showMenu: boolean) => void
  setShowIntro: (showIntro: boolean) => void

}

const useStore = create<StoreState>((set) => ({
  showMenu: false,
  showIntro: true,
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
}));

export default useStore;
