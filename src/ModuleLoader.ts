import { BaseModule, Module } from "./Module";
import { Leaderboard } from "./modules/Leaderboard";
import { Ping } from "./modules/Ping";
import { Sherlock } from "./modules/Sherlock";
import { TimeUpdater } from "./modules/TimeUpdater";
import { VideoGrabber } from "./modules/VideoGrabber";

export const modules: Array<any> = [
    Ping,
    // TimeUpdater,
    // VideoGrabber,
    // Leaderboard,
    Sherlock
]