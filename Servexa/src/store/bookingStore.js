import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBookingStore = create(
    persist(
        (set) => ({
            draftBookingId: null,
            selectedShopId: null,
            currentStep: 0, // 0: Cart/Draft, 1: Address, 2: Slot, 3: Summary, 4: Confirmed

            setDraftBooking: (id, shopId) => set({ draftBookingId: id, selectedShopId: shopId }),
            clearBooking: () => set({ draftBookingId: null, selectedShopId: null, currentStep: 0 }),
            setStep: (step) => set({ currentStep: step }),
        }),
        {
            name: "booking-storage",
            partialize: (state) => ({ draftBookingId: state.draftBookingId, selectedShopId: state.selectedShopId }),
        }
    )
);
