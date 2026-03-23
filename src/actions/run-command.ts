import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { spawn } from "child_process";

@action({ UUID: "dev.frik.run-command.run" })
export class RunCommand extends SingletonAction<RunCommandSettings> {
  override onWillAppear(
    ev: WillAppearEvent<RunCommandSettings>,
  ): void | Promise<void> {
    const label = ev.payload.settings.label?.trim() || "Run";
    return ev.action.setTitle(label);
  }

  override async onKeyDown(
    ev: KeyDownEvent<RunCommandSettings>,
  ): Promise<void> {
    const { command, shell } = ev.payload.settings;

    if (!command?.trim()) {
      await ev.action.showAlert();
      return;
    }

    const { powershellProfile } = ev.payload.settings;

    const [executable, args]: [string, string[]] =
      shell === "powershell"
        ? [
            "powershell.exe",
            [
              ...(powershellProfile?.trim()
                ? ["-Command", `. '${powershellProfile.trim()}'; ${command}`]
                : ["-NoProfile", "-Command", command]),
            ],
          ]
        : ["cmd.exe", ["/c", command]];

    console.log(`Running: ${executable} ${args.join(" ")}`);

    const child = spawn(executable, args, { shell: false });

    child.stdout.on("data", (data) => console.log(`[stdout] ${data}`));
    child.stderr.on("data", (data) => console.error(`[stderr] ${data}`));

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`Command exited with code ${code}`);
        ev.action.showAlert();
      } else {
        console.log("Command executed successfully.");
        ev.action.showOk();
      }
    });
  }
}

type RunCommandSettings = {
  command?: string;
  shell?: "cmd" | "powershell";
  label?: string;
  powershellProfile?: string;
};
