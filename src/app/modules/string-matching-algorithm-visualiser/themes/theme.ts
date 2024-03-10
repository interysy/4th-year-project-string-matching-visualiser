// eslint-disable-next-line @typescript-eslint/no-empty-interface


/**
 * @description Base class for a theme, which will be used to style the visualiser. Contains default colours.
 * Other themes are to override this class.
 * @property BACKGROUND - The background colour of the visualiser.
 * @property MISMATCH - The colour of the character square when a mismatch occurs.
 * @property MATCH - The colour of the character square when a match occurs.
 * @property DEFAULT - The default colour of the character sqaure.
 * @property CHECKING - The colour of the character square when it is being checked.
 * @property BORDER_CHECK - The colour of the the character square when it is being checked for a border.
 * @property BORDER_CHECK_ONE - The colour of the border of the character square when it is being checked for the left hand side border.
 * @property BORDER_CHECK_TWO - The colour of the border of the character square when it is being checked for the right hand side border.
 * @property TEXT_COLOUR - The colour of the text in the visualiser.
 * @property TEXT_COLOUR_SECONDARY - The colour of the secondary text in the visualiser.
 * @property LINE - The colour of the lines used for annotationas in the visualiser.
 * @property DEFAULT_STROKE - The default border colour of the visualiser.
 * @property HOME_PAGE_BACKGROUND - The background of the home page.
 */
export class Theme {
    readonly BACKGROUND : string = "#FFFFFF";
    readonly MISMATCH : string = "#ff0000";
    readonly MATCH : string = "#00ff00";
    readonly DEFAULT : string = "#ffffff";
    readonly CHECKING : string = "#FFA500";
    readonly BORDER_CHECK : string = "#FFD700";
    readonly BORDER_CHECK_ONE : string = "#FFD700"
    readonly BORDER_CHECK_TWO : string = "#007BFF"
    readonly TEXT_COLOUR : string = "#000000";
    readonly TEXT_COLOUR_SECONDARY : string = "#000000";
    readonly LINE : string = "#000000";
    readonly DEFAULT_STROKE : string = "#FFFFFF";
    readonly HOME_PAGE_BACKGROUND : string = "../../../assets/animation_light.mov"
}