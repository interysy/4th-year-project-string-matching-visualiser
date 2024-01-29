import { Theme } from "./theme";

export class DefaultTheme extends Theme {
    override readonly BACKGROUND = "#FFFFFF";
    override readonly MISMATCH = "#ff0000";
    override readonly MATCH = "#00ff00";
    override readonly DEFAULT = "#ffffff";
    override readonly CHECKING = "#FFA500";
    override readonly BORDER_CHECK = "#FFD700";
    override readonly BORDER_CHECK_ONE = "#FFD700"
    override readonly BORDER_CHECK_TWO = "#007BFF"
    override readonly TEXT_COLOUR = "#000000";
    override readonly TEXT_COLOUR_SECONDARY = "#000000";
    override readonly LINE = "#000000";
    override readonly DEFAULT_STROKE = "#FFFFFF";
}