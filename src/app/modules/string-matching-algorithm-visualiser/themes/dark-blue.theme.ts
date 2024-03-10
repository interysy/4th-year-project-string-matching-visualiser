import { Theme } from "./theme";


/**
 * @description Alternative dark theme for the visualiser.
 * Overrides the base theme class with dark blue colours.
 */
export class DarkBlueTheme extends Theme {
    override readonly BACKGROUND = "#1C2128";
    override readonly MISMATCH = "#ff0000";
    override readonly MATCH = "#29FD2F";
    override readonly DEFAULT = "#FFFFFF"
    override readonly CHECKING = "#FFA500";
    override readonly BORDER_CHECK = "#ADD8E6";
    override readonly BORDER_CHECK_ONE = "#FFD700"
    override readonly BORDER_CHECK_TWO = "#007BFF"
    override readonly TEXT_COLOUR = "#FFFFFF";
    override readonly TEXT_COLOUR_SECONDARY = "#000000";
    override readonly LINE = "#FFFFFF";
    override readonly DEFAULT_STROKE = "#000000";
    override readonly HOME_PAGE_BACKGROUND : string = "../../../assets/animation_dark.mov";
}