import {ConfigurationCommand} from '@/classes/Commands/SoloConfigurator/ConfigurationCommand';
import axios from 'axios';
import {SelectionState} from "@/classes/Configurator/SelectionState";

export class ResetCommand extends ConfigurationCommand {
    constructor(featureModel, data) {
        super(featureModel);
        this.newSatCount = 0;
        this.description = "Reset";

        if (data) {
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
            this.newOpenParentFeatures = featureModel.features.filter(f => f.open === null);
            this.newOpenChildrenFeatures = featureModel.features.filter(f => f.open === false);
            this.newNotOpenFeatures = featureModel.features.filter(f => f.open === true);
        }
    }

    execute() {
        super.execute();
    }

    copy() {
        const command = new ResetCommand(this.featureModel, this.xml);
        command.newSatCount = this.newSatCount;

        command.newExplicitlySelectedFeatures = this.newExplicitlySelectedFeatures;
        command.newImplicitlySelectedFeatures = this.newImplicitlySelectedFeatures;
        command.newExplicitlyDeselectedFeatures = this.newExplicitlyDeselectedFeatures;
        command.newImplicitlyDeselectedFeatures = this.newImplicitlyDeselectedFeatures;
        command.newUnselectedFeatures = this.newUnselectedFeatures;
        command.newOpenParentFeatures = this.newOpenParentFeatures;
        command.newOpenChildrenFeatures = this.newOpenChildrenFeatures;
        command.newNotOpenFeatures = this.newNotOpenFeatures;
        return command;
    }
}
