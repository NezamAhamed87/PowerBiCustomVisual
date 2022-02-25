/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;


import { VisualSettings } from "./settings";

export function logExceptions(): MethodDecorator {
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
        return {
            value: function () {
                try {
                    return descriptor.value.apply(this, arguments);
                } catch (e) {
                    console.error(e);
                    throw e;
                }
            }
        }
    }
}

export class Visual implements IVisual {
    private target: HTMLElement;
    private host: IVisualHost;
    private table: HTMLParagraphElement;
    private settings: VisualSettings;

    constructor(options: VisualConstructorOptions) {
        // constructor body
        this.target = options.element;
        this.host = options.host;
        this.table = document.createElement("table");
        this.target.appendChild(this.table);
        // ...
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    @logExceptions()
    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);       

        debugger;
        const dataView: DataView = options.dataViews[0];
        const tableDataView: any = dataView.table;

        if (!tableDataView) {
            return
        }
        while(this.table.firstChild) {
            this.table.removeChild(this.table.firstChild);
        }

        //draw header
        const tableHeader = document.createElement("th");
        tableDataView.columns.forEach((column: any) => {
            const tableHeaderColumn = document.createElement("td");
            tableHeaderColumn.innerText = column.displayName
            tableHeader.appendChild(tableHeaderColumn);
        });
        this.table.appendChild(tableHeader);

        //draw rows
        var i=0;
        tableDataView.rows.forEach((row: any) => {
            if(i==0)
            {
                const tableRow = document.createElement("tr");            
                row.forEach((columnValue: any) => {               
                    const cell = document.createElement("td");
                    cell.innerText = columnValue.toString();
                    tableRow.appendChild(cell);                                
                }) 
                this.table.appendChild(tableRow);
                i++;              
            }                            
        });
    }

      /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
       public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}

// export class Visual implements IVisual {
//     // ...
//     private host: IVisualHost;
//     private svg: Selection<SVGElement>;
//     private container: Selection<SVGElement>;
//     private textValue: Selection<SVGElement>;
//     private textLabel: Selection<SVGElement>;
//     // ...

//     constructor(options: VisualConstructorOptions) {
//         this.svg = d3.select(options.element)
//             .append('svg');
//         this.container = this.svg.append("g")
//             .classed('container', true);
//         // this.textValue = this.container.append("text")
//         //     .classed("textValue", true);
//         // this.textLabel = this.container.append("text")
//         //     .classed("textLabel", true);            
//     }

//     @logExceptions()
//     public update(options: VisualUpdateOptions) {
//         var positioni = 10;
        
//         options.dataViews.forEach(element => {
//             debugger;
//             let dataView: DataView = element; //options.dataViews[0];        
//             let width: number = options.viewport.width + positioni;
//             let height: number = options.viewport.height + positioni;
//             this.svg.attr("width", width);
//             this.svg.attr("height", height);
//             let radius: number = Math.min(width, height) / 2.2;
//             let fontSizeValue: number = Math.min(width, height) / 5;

//             if (dataView.single != null) {
//                 this.container.append("text").classed("textValue", true)
//                     .text(<string>dataView.single.value)
//                     .attr("x", "50%")
//                     .attr("y", "20%")
//                     .attr("dy", "0.35em")
//                     .attr("text-anchor", "middle")
//                     .style("font-size", fontSizeValue + "px");
//                 this.container.append("text").classed("textLabel", true)
//                     .text(dataView.metadata.columns[0].displayName)
//                     .attr("x", "50%")
//                     .attr("y", height / 2)
//                     .attr("dy", fontSizeValue / 1.2)
//                     .attr("text-anchor", "middle")
//                     .style("font-size", fontSizeValue + "px")
//                 positioni = positioni + 20;
//             }
//             else if(dataView.metadata.columns.length!=0)
//             {
//                 // this.container.append("text").classed("textValue", true)
//                 //     .text(<string>dataView.metadata.columns.forEach.value)
//                 //     .attr("x", "50%")
//                 //     .attr("y", "20%")
//                 //     .attr("dy", "0.35em")
//                 //     .attr("text-anchor", "middle")
//                 //     .style("font-size", fontSizeValue + "px");
//                 // this.container.append("text").classed("textLabel", true)
//                 //     .text(dataView.metadata.columns[0].displayName)
//                 //     .attr("x", "50%")
//                 //     .attr("y", height / 2)
//                 //     .attr("dy", fontSizeValue / 1.2)
//                 //     .attr("text-anchor", "middle")
//                 //     .style("font-size", fontSizeValue + "px")
//                 // positioni = positioni + 20;
//             }
            
//         });

//     }


// }
