import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import EditToolbar from './EditToolbar.js';
import EditGlobals from '../EditGlobals.js';

const {
    addEvent,
    merge
} = U;

class CellEditToolbar extends EditToolbar {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: CellEditToolbar.Options = {
        enabled: true,
        tools: ['drag', 'cellOptions']
    }

    public static tools: Record<string, EditToolbar.ToolOptions> =
    merge(EditToolbar.tools, {
        cellOptions: {
            type: 'cellOptions',
            // className: EditGlobals.classNames.editToolbarItem,
            text: 'opt',
            events: {
                click: function (this: CellEditToolbar, e: any): void {
                    this.onCellOptions(e);
                }
            }
        }
    })

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        editMode: EditMode,
        options?: CellEditToolbar.Options|undefined
    ) {
        super(editMode, merge(CellEditToolbar.defaultOptions, options || {}));
        this.setEvents();

        super.initTools(CellEditToolbar.tools);
    }

    /* *
    *
    *  Properties
    *
    * */
    public cell?: Cell;

    /* *
    *
    *  Functions
    *
    * */

    private setEvents(): void {
        const toolbar = this,
            dashboard = toolbar.editMode.dashboard;

        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            const layout = dashboard.layouts[i];

            for (let j = 0, jEnd = layout.rows.length; j < jEnd; ++j) {
                const row = layout.rows[j];

                for (let k = 0, kEnd = row.cells.length; k < kEnd; ++k) {
                    const cell = row.cells[k];

                    if (cell.container) {
                        addEvent(cell.container, 'mousemove', function (): void {
                            toolbar.onMouseMove(cell);
                        });
                    }
                }
            }
        }
    }

    private onMouseMove(
        cell: Cell
    ): void {
        const toolbar = this,
            cellCnt = cell.container;

        let x, y;

        if (cellCnt) {
            x = ((cellCnt.parentElement || {}).offsetLeft || 0) +
              cellCnt.offsetLeft + cellCnt.offsetWidth - 30;

            y = ((cellCnt.parentElement || {}).offsetTop || 0) +
              cellCnt.offsetTop;

            super.show(x, y, ['drag', 'cellOptions']);
            toolbar.cell = cell;
        }
    }

    public onCellOptions(
        e: any
    ): void {
        const toolbar = this;

        if (toolbar.editMode.optionsToolbar) {
            // ['title', 'option1'] will be dynamic.
            toolbar.editMode.optionsToolbar.showOptions([
                'title',
                'option1'
            ]);

            // temporary -> move to OptionsToolbar
            // highcharts-dashboard-edit-hidden-cells
            console.log('cell', this.cell);
            this.cell?.container?.classList.add(EditGlobals.classNames.currentEditedCell);
            this.cell?.row.layout.dashboard.container.classList.add(
                EditGlobals.classNames.disabledNotEditedCells
            );
        }
    }

    public hide(): void {
        super.hide();
        this.cell = void 0;
    }
}

namespace CellEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default CellEditToolbar;
