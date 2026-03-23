import streamDeck from "@elgato/streamdeck";

import { RunCommand } from "./actions/run-command";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel("trace");

// Register actions.
streamDeck.actions.registerAction(new RunCommand());

// Finally, connect to the Stream Deck.
streamDeck.connect();
