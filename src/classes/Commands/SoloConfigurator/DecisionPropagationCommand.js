import {ConfigurationCommand} from "@/classes/Commands/SoloConfigurator/ConfigurationCommand";
import {SelectionState} from "@/classes/Configurator/SelectionState";
import axios from 'axios';
import {de} from "vuetify/locale";

export class DecisionPropagationCommand extends ConfigurationCommand {
    constructor(featureModel, data, feature, newSelectionState) {
        super(featureModel);
        this.executed = false;
        this.newSatCount = 0;
        this.description = "";

        feature.selectionState = newSelectionState;
        if (newSelectionState === SelectionState.Unselected) {
            if (feature.selectionState === SelectionState.ExplicitlySelected) {
                this.description = "Undone selection";
            } else if (feature.selectionState === SelectionState.ExplicitlyDeselected) {
                this.description = "Undone deselection";
            }
        } else {
            if (newSelectionState === SelectionState.ExplicitlySelected) {
                this.description = "Selected";
            } else if (newSelectionState === SelectionState.ExplicitlyDeselected) {
                this.description = "Deselected";
            }
        }
        this.description += " " + (feature.name);

        if (data) {
            this.valid = true;

            this.newExplicitlySelectedFeatures = data.eSF;
            this.newImplicitlySelectedFeatures = data.iSF;
            this.newExplicitlyDeselectedFeatures = data.eDF;
            this.newImplicitlyDeselectedFeatures = data.iDF;
            this.newUnselectedFeatures = data.uF;
            this.newOpenParentFeatures = data.oPF;
            this.newOpenChildrenFeatures = data.oCF;
            this.newNotOpenFeatures = data.nOF;
        } else {
            this.newExplicitlySelectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.ExplicitlySelected);
            this.newImplicitlySelectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.ImplicitlySelected);
            this.newExplicitlyDeselectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.ExplicitlyDeselected);
            this.newImplicitlyDeselectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.ImplicitlyDeselected);
            this.newUnselectedFeatures = featureModel.features.filter(f => f.selectionState === SelectionState.Unselected);
            this.newOpenParentFeatures = featureModel.features.filter(f => f.open === false);
            this.newOpenChildrenFeatures = featureModel.features.filter(f => f.open === true);
            this.newNotOpenFeatures = featureModel.features.filter(f => f.open === null);
        }

    }

    execute() {
        super.execute();
    }
}
