import create from "zustand";

export interface StoreState {
  showMenu: boolean
  showMenuMobile: boolean
  images: FileField[]
  imageId: string
  setShowMenu: (showMenu: boolean) => void
  setShowMenuMobile: (showMenuMobile: boolean) => void
  setImages: (images: FileField[] | undefined) => void
  setImageId: (imageId: string | undefined) => void
}

const useStore = create<StoreState>((set) => ({
  showMenu: false,
  showMenuMobile: false,
  images: [],
  imageId: undefined,
  setShowMenu: (showMenu: boolean) =>
    set((state) => ({
      showMenu
    })
    ),
  setShowMenuMobile: (showMenuMobile: boolean) =>
    set((state) => ({
      showMenuMobile
    })
    ),
  setImageId: (imageId: string | undefined) =>
    set((state) => ({
      imageId
    })
    ),
  setImages: (images: FileField[] | undefined) =>
    set((state) => ({
      images
    })
    ),
}));

export default useStore;
export { useStore };
