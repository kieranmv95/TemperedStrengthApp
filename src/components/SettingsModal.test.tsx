import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import { SettingsModal } from "./SettingsModal";
import { clearProgramData } from "../utils/storage";

jest.mock("../utils/storage", () => ({
  clearProgramData: jest.fn(),
}));

describe("SettingsModal", () => {
  it("clears program data when change program is confirmed", async () => {
    const onClose = jest.fn();
    const onProgramReset = jest.fn();
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    (clearProgramData as jest.Mock).mockResolvedValue(undefined);

    const { getByText } = render(
      <SettingsModal
        visible
        onClose={onClose}
        onProgramReset={onProgramReset}
      />
    );

    fireEvent.press(getByText("Change Program"));

    const buttons = alertSpy.mock.calls[0]?.[2];
    const confirm = buttons?.find(
      (button: { text?: string }) => button.text === "Change Program"
    );

    await act(async () => {
      await confirm?.onPress?.();
    });

    expect(clearProgramData).toHaveBeenCalled();
    expect(onProgramReset).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
