import { MatchingAlgorithmColourConstants } from "./matching-algorithm-colours.constant";

export class DefaultTheme implements MatchingAlgorithmColourConstants{
    readonly BACKGROUND = "#FFFFFF";
    readonly MISMATCH = "#ff0000";
    readonly MATCH = "#00ff00";
    readonly DEFAULT = "#ffffff";
    readonly CHECKING = "#FFA500";
    readonly BORDER_CHECK = "#FFD700";
    readonly BORDER_CHECK_ONE = "#FFD700"
    readonly BORDER_CHECK_TWO = "#007BFF"
    readonly TEXT_COLOUR = "#000000";
    readonly TEXT_COLOUR_SECONDARY = "#000000";
    readonly LINE = "#000000";
    readonly DEFAULT_STROKE = "#FFFFFF";
}