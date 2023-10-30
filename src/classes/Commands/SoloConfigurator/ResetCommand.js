import {ConfigurationCommand} from '@/classes/Commands/SoloConfigurator/ConfigurationCommand';
import axios from 'axios';

export class ResetCommand extends ConfigurationCommand {
    constructor(featureModel, data) {
        super(featureModel);
        this.executed = false;
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

        command.executed = true;
        return command;
    }
}
