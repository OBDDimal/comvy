import {ConfigurationCommand} from "@/classes/Commands/SoloConfigurator/ConfigurationCommand";
import {SelectionState} from "@/classes/Configurator/SelectionState";
import axios from 'axios';
import {de} from "vuetify/locale";

export class DecisionPropagationCommand extends ConfigurationCommand {
    constructor(featureModel, data, description) {
        super(featureModel);
        this.executed = false;
        this.newSatCount = 0;
        this.description = description;

        if (data) {
            this.newExplicitlySelectedFeatures = data.eSF;
            this.newImplicitlySelectedFeatures = data.iSF;
            this.newExplicitlyDeselectedFeatures = data.eDF;
            this.newImplicitlyDeselectedFeatures = data.iDF;
            this.newUnselectedFeatures = data.uF;
            this.newOpenParentFeatures = data.oPF;
            this.newOpenChildrenFeatures = data.oCF;
            this.newNotOpenFeatures = data.nOF;
        }

    }

    execute() {
        super.execute();
    }
}
