type CanvasLayoutItem = {
    rowSpan: number;
    colSpan: number;
    row : number;
    col : number;
    function: string;
  };

export type CanvasLayout = {
    rows: number;
    columns: number;
    layout: CanvasLayoutItem[];
  };
