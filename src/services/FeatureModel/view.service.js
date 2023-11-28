import * as d3 from "d3";

export function reset(d3Data, uncollapsedLevels = 0, maxChildrenCount = 3) {
    // Collapses all nodes after depth 1.
    d3Data.root.data.each(node => node.collapse());

    let currentChildren = [d3Data.root.data];
    if (uncollapsedLevels !== 0) {
        for (let i = 1; i <= uncollapsedLevels; i++) {
            currentChildren.forEach(child => {
                if (child.children.length <= maxChildrenCount) {
                    child.uncollapse(false);
                }
            });
            currentChildren = currentChildren
                .map(parent => parent.children.length <= maxChildrenCount ? parent.children : [])
                .flat();

            if (currentChildren.length === 0) {
                break;
            }
        }
    } else {
        for (let i = 1; i < 4; i++) {

            currentChildren.forEach(child => {
                child.uncollapse(false);
            });
            currentChildren = currentChildren.map(parent => parent.children)
                .flat();

            if (currentChildren.length === 0) {
                break;
            }
        }
    }
}

export function zoomFit(d3Data, padding = 1) {
    let bounds = document.querySelector('svg > g').getBBox();
    let fullWidth = document.querySelector('svg').getBoundingClientRect().width,
        fullHeight = document.querySelector('svg').getBoundingClientRect().height;
    let width = bounds.width,
        height = bounds.height;
    let midX = bounds.x + width / 2,
        midY = bounds.y + height / 2;

    // nothing to fit
    if (width === 0 || height === 0) {
        return;
    }

    let scale = padding / Math.max(width / fullWidth, height / fullHeight);

    d3.select('svg').call(d3Data.zoom.translateTo, midX, midY).call(d3Data.zoom.scaleTo, scale);
}

export function focusNode(d3Data, d3Node) {
    d3.select('svg').call(d3Data.zoom.translateTo, d3Node.x, d3Node.y);
}
