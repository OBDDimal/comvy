import {ConfigurationCommand} from '@/classes/Commands/SoloConfigurator/ConfigurationCommand';
import {SelectionState} from '@/classes/Configurator/SelectionState';

export class LoadConfigCommand extends ConfigurationCommand {
    constructor(featureModel, features) {
        super(featureModel);

        this.newSatCount = 0;

        this.selection = features.filter(f => f.selectionState === SelectionState.ExplicitlySelected).map(f => f.name);
        this.deselection = features.filter(f => f.selectionState === SelectionState.ExplicitlyDeselected).map(f => f.name);
        this.impliedSelection = features.filter(f => f.selectionState === SelectionState.ImplicitlySelected).map(f => f.name);
        this.impliedDeselection = features.filter(f => f.selectionState === SelectionState.ImplicitlyDeselected).map(f => f.name);

        this.newExplicitlySelectedFeatures = this.featureModel.features.filter(f => this.selection.includes(f.name));
        this.newImplicitlySelectedFeatures = this.featureModel.features.filter(f => this.impliedSelection.includes(f.name));
        this.newExplicitlyDeselectedFeatures = this.featureModel.features.filter(f => this.deselection.includes(f.name));
        this.newImplicitlyDeselectedFeatures = this.featureModel.features.filter(f => this.impliedDeselection.includes(f.name));
        this.newUnselectedFeatures = this.featureModel.features.filter(f => !(this.selection.includes(f.name) || this.impliedSelection.includes(f.name) || this.deselection.includes(f.name) || this.impliedDeselection.includes(f.name)));
        this.newOpenParentFeatures = [];
        this.newOpenChildrenFeatures = [];
        this.newNotOpenFeatures = this.featureModel.features;

        this.description = "Load from Configuration File."
    }

    execute() {
        super.execute();
    }
}
