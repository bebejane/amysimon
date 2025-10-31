import { create } from 'zustand';
export { useShallow } from 'zustand/shallow';

export interface StoreState {
	isHome: boolean;
	showMenu: boolean;
	showIntroLoading: boolean;
	showIntro: boolean;
	setIsHome: (isHome: boolean) => void;
	setShowMenu: (showMenu: boolean) => void;
	setShowIntro: (showIntro: boolean) => void;
	setShowIntroLoading: (showIntro: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
	showMenu: false,
	showIntro: true,
	showIntroLoading: true,
	isHome: false,
	setIsHome: (isHome: boolean) =>
		set((state) => ({
			isHome,
		})),
	setShowMenu: (showMenu: boolean) =>
		set((state) => ({
			showMenu,
		})),
	setShowIntro: (showIntro: boolean) =>
		set((state) => ({
			showIntro,
		})),
	setShowIntroLoading: (showIntroLoading: boolean) =>
		set((state) => ({
			showIntroLoading,
		})),
}));

export default useStore;
