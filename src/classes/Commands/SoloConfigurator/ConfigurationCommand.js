import {Command} from "@/classes/Commands/Command";
import {SelectionState} from "@/classes/Configurator/SelectionState";
import {updateSvg} from "@/services/Configurator/update.service";

export class ConfigurationCommand extends Command {
    constructor(featureModel) {
        super();
        this.featureModel = featureModel;
        this.valid = false;

        this.oldExplicitlySelectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.ExplicitlySelected);
        this.oldImplicitlySelectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.ImplicitlySelected);
        this.oldExplicitlyDeselectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.ExplicitlyDeselected);
        this.oldImplicitlyDeselectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.ImplicitlyDeselected);
        this.oldUnselectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.Unselected);
        this.oldNotOpenFeatures = featureModel.features.filter(f => f.open === null);
        this.oldOpenParentFeatures = featureModel.features.filter(f => f.open === false);
        this.oldOpenChildrenFeatures = featureModel.features.filter(f => f.open === true);

        this.newExplicitlySelectedFeatures = [];
        this.newImplicitlySelectedFeatures = [];
        this.newExplicitlyDeselectedFeatures = [];
        this.newImplicitlyDeselectedFeatures = [];
        this.newUnselectedFeatures = [];
        this.newOpenParentFeatures = [];
        this.newOpenChildrenFeatures = [];
        this.newNotOpenFeatures = [];

        this.oldSatCount = this.featureModel.satCount;

        this.marked = false;
    }

    execute() {

        this.newExplicitlySelectedFeatures.forEach(f => f.selectionState = SelectionState.ExplicitlySelected);
        this.newImplicitlySelectedFeatures.forEach(f => f.selectionState = SelectionState.ImplicitlySelected);
        this.newExplicitlyDeselectedFeatures.forEach(f => f.selectionState = SelectionState.ExplicitlyDeselected);
        this.newImplicitlyDeselectedFeatures.forEach(f => f.selectionState = SelectionState.ImplicitlyDeselected);
        this.newUnselectedFeatures.forEach(f => f.selectionState = SelectionState.Unselected);
        this.newNotOpenFeatures.forEach(f => f.open = null)
        this.newOpenParentFeatures.forEach(f => f.open = false);
        this.newOpenChildrenFeatures.forEach(f => f.open = true);

        if(!this.valid) {
            this.valid = this.featureModel.checkValidity();
            console.log(this.valid);
        }

        this.featureModel.satCount = this.newSatCount;
        updateSvg();
    }

    undo() {
        this.oldExplicitlySelectedFeatures.forEach(f => f.selectionState = SelectionState.ExplicitlySelected);
        this.oldImplicitlySelectedFeatures.forEach(f => f.selectionState = SelectionState.ImplicitlySelected);
        this.oldExplicitlyDeselectedFeatures.forEach(f => f.selectionState = SelectionState.ExplicitlyDeselected);
        this.oldImplicitlyDeselectedFeatures.forEach(f => f.selectionState = SelectionState.ImplicitlyDeselected);
        this.oldUnselectedFeatures.forEach(f => f.selectionState = SelectionState.Unselected);
        this.oldNotOpenFeatures.forEach(f => f.open = null)
        this.oldOpenParentFeatures.forEach(f => f.open = false);
        this.oldOpenChildrenFeatures.forEach(f => f.open = true);

        this.featureModel.satCount = this.oldSatCount;
        updateSvg();
    }

    unmarkChanges() {
        this.marked = false;
    }

    markChanges() {
        this.marked = true;
    }

    formatScientificNotation(number) {
        const exponential = number.toExponential();
        const parts = exponential.split("e+");


        const coefficient = (Math.round(parseFloat(parts[0]) * 10, 2) / 10).toLocaleString("en-US");
        const exponent = parts[1];
        if (exponent < 8) {
            return new Intl.NumberFormat("en-US", {notation: 'standard'}).format(number);
        }
        return `${coefficient} * 10^${exponent}`;
    }
}
