<template>
    <navbar
            :file-is-loaded='fmIsLoaded'
            :service-is-feature-i-d-e='serviceIsFeatureIDE'
            :service-is-flask='!serviceIsFeatureIDE'
            :service-is-working='serviceIsWorking'
            :command-manager="commandManager"
            @download='downloadXML'
            @localStorage='save'
            @openConf='openConfigFileDialog'
            @openFile='openFileDialog'
            @reset='resetCommand'
            @theme="dark = !dark"
            @change-service="(boolean) => changeService(boolean)"
    ></navbar>
    <v-container :fluid='true'>
        <template v-if="fmIsLoaded">

            <!-- First row with the three columns: Versions, Features, Third Column (#SAT, Explanations, Configuration history) -->
            <v-row>
                <v-col cols='4'>
                    <v-card height='89.5vh'>
                        <v-card-title>
                            <v-layout class='align-center' row>
                                <!-- Heading features -->
                                <div class='mr-2'>
                                    <span>Features ({{ featureModelSolo.features?.length }}) </span>
                                </div>

                                <!-- Statistics about the features as tooltip-->
                                <v-tooltip location='bottom'>
                                    <template v-slot:activator='{ props }'>
                                        <v-icon v-bind='props'>mdi-information</v-icon>
                                    </template>
                                    <table>
                                        <tr>
                                            <th>Selection</th>
                                            <th>All</th>
                                        </tr>
                                        <tr>
                                            <td>All</td>
                                            <td>{{ featureModelSolo.features?.length }}</td>
                                        </tr>
                                        <tr>
                                            <td>Unselected</td>
                                            <td>{{
                                                countSelectionStateInList(featureModelSolo.features, SelectionState.Unselected)
                                                }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Explicitly selected</td>
                                            <td>{{
                                                countSelectionStateInList(featureModelSolo.features, SelectionState.ExplicitlySelected)
                                                }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Explicitly deselected</td>
                                            <td>{{
                                                countSelectionStateInList(featureModelSolo.features, SelectionState.ExplicitlyDeselected)
                                                }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Implicitly selected</td>
                                            <td>{{
                                                countSelectionStateInList(featureModelSolo.features, SelectionState.ImplicitlySelected)
                                                }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Implicitly deselected</td>
                                            <td>{{
                                                countSelectionStateInList(featureModelSolo.features, SelectionState.ImplicitlyDeselected)
                                                }}
                                            </td>
                                        </tr>
                                    </table>
                                </v-tooltip>
                                <div style="width: 20rem"></div>
                                <v-checkbox
                                        v-model="validCheckbox"
                                        density="compact"
                                        hide-details
                                        label="Valid"
                                ></v-checkbox>
                            </v-layout>
                        </v-card-title>

                        <!-- Tabs to select (Feature Model Viewer, List Tree, Cross-Tree Constraints -->
                        <v-tabs v-model='tabsFirstColumn'>
                            <v-tab key='dataTable'>Data Table</v-tab>
                            <v-tab key='treeView'>Tree View</v-tab>
                        </v-tabs>
                        <!-- Search box for features -->
                        <v-layout class="align-center justify-center" row>
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                            class="mx-1"
                                            icon="mdi-menu"
                                            v-bind="props"
                                    >
                                    </v-btn>
                                </template>
                                <v-list density='compact'>
                                    <v-list-item title='Show Open Features'>
                                        <template v-slot:prepend>
                                            <v-checkbox
                                                    v-model="showOpenFeatures"
                                                    density="compact"
                                                    hide-details
                                                    @input="updateFeatures"
                                            ></v-checkbox>
                                        </template>
                                    </v-list-item>
                                    <v-list-item title='Show Abstract Features'>
                                        <template v-slot:prepend>
                                            <v-checkbox
                                                    v-model="showAbstractFeatures"
                                                    density="compact"
                                                    hide-details
                                                    @input="updateFeatures"
                                            ></v-checkbox>
                                        </template>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            <v-text-field
                                    v-model='searchFeatures'
                                    :clearable=true
                                    append-inner-icon='mdi-magnify'
                                    class='mr-2 ml-2'
                                    hide-details
                                    label='Search'
                                    single-line
                            ></v-text-field>
                        </v-layout>
                        <v-window v-model='tabsFirstColumn'>

                            <!-- Feature Model Viewer -->
                            <v-window-item key='dataTable'>


                                <!-- Table with all features that are currently fitlered and searched -->
                                <v-data-table
                                        :headers='headersFeatures'
                                        :items='featuresTrimmed'
                                        :search='searchFeatures'
                                        disable-pagination
                                        fixed-header
                                        height='67.75vh'
                                        hide-default-footer
                                        item-key='name'
                                        show-group-by
                                        single-select
                                >
                                    <!-- Customization of the column NAME -->
                                    <template v-slot:item.name='{ item }'>
                                        <v-tooltip location='bottom'>
                                            <template v-slot:activator='{ props }'>
                                                <span v-bind='props'>{{ item.selectable.name }}</span>
                                                <template v-if="item.selectable.isAbstract">
                                                    <i> Abstract</i>
                                                </template>
                                            </template>
                                            <span>Var ID: {{ item.selectable.id }}</span>
                                        </v-tooltip>
                                    </template>

                                    <!-- Customization of the column SELECTIONSTATE -->
                                    <template v-slot:item.selectionState='{ item }'>
                                        <DoubleCheckbox v-bind:selection-item='item.selectable'
                                                        @select='(selection) => decisionPropagation(item.selectable, selection)'></DoubleCheckbox>
                                    </template>

                                </v-data-table>
                            </v-window-item>
                            <v-window-item key='treeView'>
                                Not Implemented yet. Waiting for V-TreeView Component
                            </v-window-item>
                        </v-window>

                    </v-card>
                </v-col>

                <v-col cols='8'>

                    <!-- Details of the selected version -->
                    <v-card height='89.5vh'>
                        <v-card-title>Details for {{ featureModelName }}:</v-card-title>

                        <!-- Tabs to select (Feature Model Viewer, List Tree, Cross-Tree Constraints -->
                        <v-tabs v-model='tabsSecondColumn'>
                            <v-tab key='featureModelViewer'>Feature Model Viewer</v-tab>
                            <v-tab key='ctc'>Cross Tree Constraints</v-tab>
                            <v-tab key='conf'>Configuration History</v-tab>
                        </v-tabs>

                        <v-card-text v-if='featureModelSolo?.root'>
                            <v-window v-model='tabsSecondColumn'>

                                <!-- Feature Model Viewer -->
                                <v-window-item key='featureModelViewer'>
                                    <feature-model-viewer-solo ref="featureModelViewerSolo"
                                                               :dark='dark'
                                                               :feature-model='featureModelSolo'
                                                               @select='(name) => searchFeatures = name'
                                    ></feature-model-viewer-solo>
                                </v-window-item>

                                <!-- Cross-Tree Constraint Viewer -->
                                <v-window-item key='ctc'>

                                    <!-- Filter only the invalid ctcs and reset them to default -->
                                    <!--                <v-btn class='mx-2' outlined
                                                           rounded @click='filteredConstraints = allConstraints.filter(c => c.evaluation === false)'>
                                                      Only invalid
                                                    </v-btn>
                                                    <v-btn outlined rounded @click='filteredConstraints = allConstraints'>Reset</v-btn>-->

                                    <!-- Table with all ctcs -->
                                    <v-data-table
                                            v-model:sort-by="sortByCTC"
                                            :custom-key-sort="sortByCTCEval"
                                            :footer-props="{'items-per-page-options': [10, 20, 50, 100, 200]}"
                                            :headers="headersCTC"
                                            :items='filteredConstraints'
                                            fixed-header
                                            height='72vh'
                                            show-group-by
                                    >

                                        <!-- Customization of the column FORMULA -->
                                        <template v-slot:item.formula='{ item }'>
                                            <div v-for='(f, i) in item.selectable.formula' :key='i'
                                                 style='display: inline;'>
                                                <v-chip
                                                        v-if='f instanceof FeatureNodeConstraintItem'
                                                        :color='getColorOfConstraintItem(f)'
                                                        class='ml-2 mr-2'
                                                        @click='searchFeatures = f.featureNode.name'
                                                >
                                                    {{ f.featureNode.name }}
                                                </v-chip>
                                                <span v-else>{{ f }}</span>
                                            </div>
                                        </template>

                                        <!-- Customization of the column EVALUATION -->
                                        <template v-slot:item.evaluation='{ item }'>
                                            <v-avatar :color='evaluateCTC(item.selectable)'
                                                      size='30'></v-avatar>
                                        </template>

                                    </v-data-table>
                                </v-window-item>
                                <v-window-item key='conf'>
                                    <v-data-table
                                            :headers="[{title: 'Description', key: 'description'}, {title: '# Possible configs', key: 'newSatCount'}, {title: 'Validation', key: 'valid'}]"
                                            :item-class="command => command.marked ? 'active-command clickable' : 'clickable'"
                                            :items='commandManager.commands'
                                            class='elevation-1'
                                            disable-filtering
                                            disable-pagination
                                            disable-sort
                                            fixed-header
                                            height='72vh'
                                            hide-default-footer
                                            single-select
                                            @click:row='redoCommand'
                                    >

                                        <template v-slot:item.valid="{ item }">
                                            {{ item.selectable.valid ? 'true' : 'false' }}
                                        </template>
                                    </v-data-table>
                                </v-window-item>
                            </v-window>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
        <template v-else>
            <v-card :class="{ 'grey lighten-2': dragover }"
                    :color="dragover ? 'grey-lighten-1': ''"
                    class="d-flex align-center justify-center"
                    height='89.5vh'
                    @click="openFilePicker"
                    @drop.prevent="onFileDrop($event)"
                    @dragover.prevent="dragover = true"
                    @dragenter.prevent="dragover = true"
                    @dragleave.prevent="dragover = false"
            >
                <v-card-text>
                    <v-row :dense="true" align="center" class="d-flex flex-column">
                        <v-icon class="mt-5" size="100">
                            mdi-cloud-upload
                        </v-icon>
                        <p class="text-h4">
                            Drop your FeatureModel file here, or click to select it.
                        </p>
                        <v-btn class="mt-6 text-h4 " color="primary" rounded="xl" variant="text"
                               @click.stop="openFromLocalStorage">
                            Or click here to load it from your local storage.
                        </v-btn>
                    </v-row>
                </v-card-text>
                <input
                        ref="filePicker"
                        accept=".xml"
                        class="d-none"
                        type="file"
                        @change="onFileInputChanged"
                >
            </v-card>
        </template>
    </v-container>

    <configurator-open-file-dialog
            :show='showOpenDialog'
            file-type="FeatureModel"
            @close='showOpenDialog = false'
            @open='(file) => openFile(file)'
    >
    </configurator-open-file-dialog>

    <configurator-open-file-dialog
            :show='showOpenConfigDialog'
            file-type="Configuration"
            @close='showOpenConfigDialog = false'
            @open='(file) => openConfig(file)'
    >
    </configurator-open-file-dialog>

</template>

<script>
import DoubleCheckbox from '@/components/Configurator/DoubleCheckbox.vue';
import {ConfiguratorManager} from '@/classes/Configurator/ConfiguratorManager';
import {QuickFixCTCCommand} from '@/classes/Commands/Configurator/QuickFixCTCCommand';
import {QuickFixFeatureCommand} from '@/classes/Commands/Configurator/QuickFixFeatureCommand';
import {RollbackFixFeatureCommand} from '@/classes/Commands/Configurator/RollbackFixFeatureCommand';
import {RollbackFixVersionCommand} from '@/classes/Commands/Configurator/RollbackFixVersionCommand';
import {RollbackFixCTCCommand} from '@/classes/Commands/Configurator/RollbackFixCTCCommand';
import {DecisionPropagationCommand} from '@/classes/Commands/SoloConfigurator/DecisionPropagationCommand';
import {ca, tr} from 'vuetify/locale';
import api from '@/services/api.service';
import {Feature} from '@/classes/Configurator/Feature';
import {FeatureNodeConstraintItem} from '@/classes/Constraint/FeatureNodeConstraintItem';
import {SelectionState} from '@/classes/Configurator/SelectionState';
import ConfiguratorOpenFileDialog from '@/components/Configurator/ConfiguratorOpenFileDialog.vue';
import FeatureModelViewerSolo from '@/components/Configurator/FeatureModelViewerSolo.vue';
import {FeatureModelSolo} from '@/classes/Configurator/FeatureModelSolo';
import {useAppStore} from '@/store/app';
import {ResetCommand} from '@/classes/Commands/SoloConfigurator/ResetCommand';
import beautify from 'xml-beautifier';
import {LoadConfigCommand} from '@/classes/Commands/SoloConfigurator/LoadConfigCommand';
import {reColorNode} from '@/services/Configurator/update.service';
import Navbar from '@/components/Navbar.vue';
import {decisionPropagationFL, pingFL} from "@/classes/BackendAccess/FlaskAccess";
import {decisionPropagationFIDE, pingFIDE} from "@/classes/BackendAccess/FeatureIDEAccess";

const appStore = useAppStore();
export default {
    name: 'FeatureModelSoloConfigurator',
    components: {Navbar, ConfiguratorOpenFileDialog, FeatureModelViewerSolo, DoubleCheckbox},

    data: () => ({
        headersFeatures: [
            {title: 'Selection', key: 'selectionState', width: '10%'},
            {title: 'Name', key: 'name', groupable: false},
        ],
        headersCTC: [{title: 'Valid', value: 'evaluation', key: 'evaluation'}, {
            title: 'Constraints',
            key: 'formula',
            value: 'formula'
        }],
        sortByCTCEval: {
            evaluation: (a, b) => {
                if (a) {
                    return 1;
                } else if (b) {
                    return -1;
                } else if (a !== undefined) {
                    return 1;
                } else if (b !== undefined) {
                    return -1;
                }
                return 0;
            }
        },
        sortByCTC: [{key: 'evaluation', order: 'desc'}],
        commandManager: new ConfiguratorManager(),
        initialResetCommand: undefined,
        featureModelSolo: FeatureModelSolo,
        fmIsLoaded: false,
        dragover: false,
        featureModelName: '',
        features: undefined,
        featuresTrimmed: undefined,
        showOpenFeatures: false,
        showAbstractFeatures: true,
        filteredConstraints: undefined,
        allConstraints: undefined,
        searchFeatures: '',
        tabsColumnTopRight: undefined,
        tabsFirstColumn: undefined,
        tabsSecondColumn: undefined,
        showOpenDialog: false,
        showOpenConfigDialog: false,
        dark: false,
        serviceIsWorking: false,
        serviceIsFeatureIDE: false,
        validCheckbox: true,
        xml: undefined
    }),

    props: {
        id: undefined
    },

    created() {
        if (this.id) {
            this.initData();
        }
        this.setStartService();
    },

    methods: {
        initData() {
            api.get(`${import.meta.env.VITE_APP_DOMAIN}files/${this.id}/`).then(
                (data) => {
                    api.get(data.data.local_file).then((rawData) => {
                        this.xml = beautify(rawData.data);
                        this.featureModelSolo = FeatureModelSolo.loadXmlDataFromFile(this.xml);
                        this.features = this.featureModelSolo.features;
                        this.updateFeatures()
                        this.featuresTrimmed = this.features.filter((f) => !f.featureNodes.find((node) => node.name === f.name).isAbstract)
                        this.featureModelName = data.data.label;
                        this.featureModelSolo.name = this.featureModelName;
                        this.allConstraints = this.featureModelSolo.constraints.map((e) => ({
                            constraint: e,
                            formula: e.toList(),
                            evaluation: e.evaluate()
                        }));
                        this.filteredConstraints = this.allConstraints;
                        this.initialResetCommand = new ResetCommand(this.featureModelSolo, this.xml);
                        this.initialResetCommand.execute();
                    });
                }
            );
        },

        save() {
            localStorage.featureModelData = this.featureModelSolo.parseToConfig();
            window.onbeforeunload = null;

            appStore.updateSnackbar(
                'Successfully saved in local storage',
                'success',
                5000,
                true
            );
        },

        downloadXML() {
            this.featureModelSolo.downloadXMLConfig();
        },

        redoCommand(event, row) {
            let command = row.item.selectable;
            this.commandManager.redoCommand(command);
        },

        resetFeaturesTable() {
            this.searchFeatures = '';
            this.features = this.featureModelSolo.features;
            this.versionForFilteringFeatures = undefined;
        },

        async decisionPropagation(item, selectionState) {
            const data = this.getSelection();
            if (selectionState === SelectionState.ExplicitlySelected) {
                data.selection.push(item.name)
            } else if (selectionState === SelectionState.ExplicitlyDeselected) {
                data.deselection.push(item.name)
            } else if (selectionState === SelectionState.Unselected) {
                if (item.selectionState === SelectionState.ExplicitlySelected) {
                    data.selection.pop(item.name)
                } else if (item.selectionState === SelectionState.ExplicitlyDeselected) {
                    data.deselection.pop(item.name)
                }
            }
            const selectionData = await this.getSelectionDataFromAPI(data);
            let command = new DecisionPropagationCommand(this.featureModelSolo, selectionData, item, selectionState, this.validCheckbox);
            this.commandManager.execute(command);
        },

        resetCommand() {
            this.commandManager.execute(this.initialResetCommand.copy());
            this.updateFeatures();
        },

        countSelectionStateInList(list, selectionState) {
            if (list) {
                return list.filter(x => x.selectionState === selectionState).length;
            } else {
                return 0;
            }
        },

        getColorOfConstraintItem(featureNodeConstraintItem) {
            const e = featureNodeConstraintItem.evaluate();
            if (e === undefined) {
                return undefined;
            } else if (e) {
                return 'green';
            } else {
                return 'red';
            }
        },

        evaluateCTC(item) {
            const evaluation = item.constraint.evaluate();
            item.evaluation = evaluation;
            return evaluation ? 'green' : (evaluation === undefined ? '' : 'red');
        },

        openFileDialog() {
            this.showOpenDialog = true;
        },

        openConfigFileDialog() {
            this.showOpenConfigDialog = true;
        },

        openFilePicker() {
            this.$refs.filePicker.click();
        },

        onFileInputChanged(e) {
            if (e.target.files.length > 1) {
                appStore.updateSnackbar(
                    'Cannot load more than one feature model.',
                    'error',
                    5000,
                    true
                );
            } else {
                this.openFile(e.target.files);
            }
        },

        async openFromLocalStorage() {
            this.fmIsLoaded = true;
            const data = localStorage.featureModelData;
            try {
                this.xml = data;
                const featureModelSolo = FeatureModelSolo.loadXmlDataFromFile(this.xml);
                this.commandManager = new ConfiguratorManager();
                this.features = featureModelSolo.features;
                this.updateFeatures();
                this.featureModelName = "LocalStorageFile";
                featureModelSolo.name = this.featureModelName;
                this.allConstraints = featureModelSolo.constraints.map((e) => ({
                    constraint: e,
                    formula: e.toList(),
                    evaluation: e.evaluate()
                }));
                this.filteredConstraints = this.allConstraints;
                this.featureModelSolo = featureModelSolo;
                const selectionData = await this.getSelectionDataFromAPI();
                this.initialResetCommand = new ResetCommand(this.featureModelSolo, selectionData);
                this.initialResetCommand.execute();
            } catch (e) {
                console.log(e);
                appStore.updateSnackbar(
                    'Could not load the feature model.',
                    'error',
                    5000,
                    true
                );
                this.fmIsLoaded = false;
            }
        },

        async openFile(files) {
            this.fmIsLoaded = true;
            const data = await files[0].text();
            try {
                this.xml = data;
                const featureModelSolo = FeatureModelSolo.loadXmlDataFromFile(this.xml);
                this.commandManager = new ConfiguratorManager();
                this.features = featureModelSolo.features;
                this.updateFeatures();
                this.featureModelName = files[0].name.slice(0, files[0].name.length - 4);
                featureModelSolo.name = this.featureModelName;
                this.allConstraints = featureModelSolo.constraints.map((e) => ({
                    constraint: e,
                    formula: e.toList(),
                    evaluation: e.evaluate()
                }));
                this.filteredConstraints = this.allConstraints;
                this.featureModelSolo = featureModelSolo;
                const selectionData = await this.getSelectionDataFromAPI();
                this.initialResetCommand = new ResetCommand(this.featureModelSolo, selectionData);
                this.initialResetCommand.execute();
            } catch (e) {
                console.log(e)
                appStore.updateSnackbar(
                    'Could not load the feature model.',
                    'error',
                    5000,
                    true
                );
                this.fmIsLoaded = false;
            }
            this.showOpenDialog = false;
        },

        openConfig(file) {
            let reader = new FileReader();
            reader.addEventListener('load', (event) => {
                try {
                    const features = FeatureModelSolo.loadXmlDataFromConfig(event.target.result);
                    const command = new LoadConfigCommand(this.featureModelSolo, features);
                    this.commandManager.execute(command);
                    this.updateFeatures();
                } catch (e) {
                    console.log(e);
                    appStore.updateSnackbar(
                        'Could not load the configuration file.',
                        'error',
                        5000,
                        true
                    );
                }
            });
            reader.readAsText(file[0]);
            this.showOpenConfigDialog = false;
        },

        onFileDrop(event) {
            this.dragover = false;
            if (event.dataTransfer.files.length > 1) {
                appStore.updateSnackbar(
                    'Cannot load more than one feature model.',
                    'error',
                    5000,
                    true
                );
            } else {
                this.openFile(event.dataTransfer.files);
            }
        },

        updateFeatures() {
            let returnFeatures = this.features;
            if (!this.showAbstractFeatures) {
                returnFeatures = returnFeatures.filter((f) => !f.isAbstract);
            }
            if (this.showOpenFeatures) {
                returnFeatures = returnFeatures.filter((f) => f.open != null);
            }
            this.featuresTrimmed = returnFeatures;
        },

        async changeService(boolean) {
            if (boolean) {
                let isAvailable = await pingFIDE();
                if (!isAvailable) {
                    appStore.updateSnackbar(
                        'Cannot change service because FeatureIDE service is down.',
                        'error',
                        5000,
                        true
                    );
                } else {
                    this.serviceIsFeatureIDE = boolean;
                    this.serviceIsWorking = true;
                }
            } else {
                let isAvailable = await pingFL();
                if (!isAvailable) {
                    appStore.updateSnackbar(
                        'Cannot change service because Flask service is down.',
                        'error',
                        5000,
                        true
                    );
                } else {
                    this.serviceIsFeatureIDE = boolean;
                    this.serviceIsWorking = true;
                }
            }
        },

        getSelection() {

            const selection = this.featureModelSolo.features.filter(f => f.selectionState === SelectionState.ExplicitlySelected).map(f => f.name);
            const deselection = this.featureModelSolo.features.filter(f => f.selectionState === SelectionState.ExplicitlyDeselected).map(f => f.name);

            return {
                selection: selection,
                deselection: deselection,
            }
        },

        async getWorkingService() {
            let result;
            if (this.serviceIsFeatureIDE) {
                result = await pingFL();
                if (result) {
                    this.serviceIsFeatureIDE = false;
                    this.serviceIsWorking = true;
                }
            } else {
                result = await pingFIDE();
                if (result) {
                    this.serviceIsFeatureIDE = true;
                    this.serviceIsWorking = true;
                }
            }
            return result;
        },

        async getSelectionDataFromAPI(data) {

            let selectionData = undefined;
            if (!this.serviceIsWorking) {
              let serviceStatus = await this.setStartService();
                if (!serviceStatus) {
                    appStore.updateSnackbar(
                        'No service is available.',
                        'error',
                        5000,
                        true
                    );
                    return undefined;
                }
            }

            if (!data) {
                if (this.serviceIsFeatureIDE) {
                    const apiData = await decisionPropagationFIDE(this.xml);
                    if (!apiData) {
                        this.serviceIsWorking = false;
                        appStore.updateSnackbar(
                            'Cannot use service because service is down. Retrying...',
                            'error',
                            5000,
                            true
                        );
                        if (await this.getWorkingService()) {
                            return await this.getSelectionDataFromAPI(data);
                        } else {
                            appStore.updateSnackbar(
                                'No service is available.',
                                'error',
                                5000,
                                true
                            );
                            return undefined;
                        }
                    }
                    selectionData = {
                        valid: apiData.valid,
                        eSF: this.featureModelSolo.features.filter(f => apiData.selection.includes(f.name)),
                        iSF: this.featureModelSolo.features.filter(f => apiData.impliedSelection.includes(f.name)),
                        eDF: this.featureModelSolo.features.filter(f => apiData.deselection.includes(f.name)),
                        iDF: this.featureModelSolo.features.filter(f => apiData.impliedDeselection.includes(f.name)),
                        uF: this.featureModelSolo.features.filter(f => !(apiData.selection.includes(f.name) || apiData.impliedSelection.includes(f.name) || apiData.deselection.includes(f.name) || apiData.impliedDeselection.includes(f.name))),
                        oPF: this.featureModelSolo.features.filter(f => apiData.openParents.includes(f.name)),
                        oCF: this.featureModelSolo.features.filter(f => apiData.openChildren.includes(f.name)),
                        nOF: this.featureModelSolo.features.filter(f => !apiData.openChildren.includes(f.name) || !apiData.openParents.includes(f.name))
                    }
                } else {
                    const apiData = await decisionPropagationFL(this.xml);
                    if (!apiData) {
                        this.serviceIsWorking = false;
                        appStore.updateSnackbar(
                            'Cannot use service because service is down. Retrying...',
                            'error',
                            5000,
                            true
                        );
                        if (await this.getWorkingService()) {
                            return await this.getSelectionDataFromAPI(data);
                        } else {
                            appStore.updateSnackbar(
                                'No service is available.',
                                'error',
                                5000,
                                true
                            );
                            return undefined;
                        }
                    }
                    selectionData = {
                        valid: apiData.valid,
                        eSF: this.featureModelSolo.features.filter(f => apiData.selection.includes(f.name)),
                        iSF: this.featureModelSolo.features.filter(f => apiData.impliedSelection.includes(f.name)),
                        eDF: this.featureModelSolo.features.filter(f => apiData.deselection.includes(f.name)),
                        iDF: this.featureModelSolo.features.filter(f => apiData.impliedDeselection.includes(f.name)),
                        uF: this.featureModelSolo.features.filter(f => !(apiData.selection.includes(f.name) || apiData.impliedSelection.includes(f.name) || apiData.deselection.includes(f.name) || apiData.impliedDeselection.includes(f.name))),
                        oPF: this.featureModelSolo.features.filter(f => apiData.openParents.includes(f.name)),
                        oCF: this.featureModelSolo.features.filter(f => apiData.openChildren.includes(f.name)),
                        nOF: this.featureModelSolo.features.filter(f => !apiData.openChildren.includes(f.name) || !apiData.openParents.includes(f.name))
                    }
                }
            } else {
                if (this.serviceIsFeatureIDE) {
                    const apiData = await decisionPropagationFIDE(this.xml, data.selection, data.deselection);
                    if (!apiData) {
                        this.serviceIsWorking = false;
                        appStore.updateSnackbar(
                            'Cannot use service because service is down. Retrying...',
                            'error',
                            5000,
                            true
                        );
                        if (await this.getWorkingService()) {
                            return await this.getSelectionDataFromAPI(data);
                        } else {
                            appStore.updateSnackbar(
                                'No service is available.',
                                'error',
                                5000,
                                true
                            );
                            return undefined;
                        }
                    }
                    selectionData = {
                        valid: apiData.valid,
                        eSF: this.featureModelSolo.features.filter(f => apiData.selection.includes(f.name)),
                        iSF: this.featureModelSolo.features.filter(f => apiData.impliedSelection.includes(f.name)),
                        eDF: this.featureModelSolo.features.filter(f => apiData.deselection.includes(f.name)),
                        iDF: this.featureModelSolo.features.filter(f => apiData.impliedDeselection.includes(f.name)),
                        uF: this.featureModelSolo.features.filter(f => !(apiData.selection.includes(f.name) || apiData.impliedSelection.includes(f.name) || apiData.deselection.includes(f.name) || apiData.impliedDeselection.includes(f.name))),
                        oPF: this.featureModelSolo.features.filter(f => apiData.openParents.includes(f.name)),
                        oCF: this.featureModelSolo.features.filter(f => apiData.openChildren.includes(f.name)),
                        nOF: this.featureModelSolo.features.filter(f => !apiData.openChildren.includes(f.name) || !apiData.openParents.includes(f.name))
                    }
                } else {
                    const apiData = await decisionPropagationFL(this.xml, data.selection, data.deselection);
                    if (!apiData) {
                        this.serviceIsWorking = false;
                        appStore.updateSnackbar(
                            'Cannot use service because service is down. Retrying...',
                            'error',
                            5000,
                            true
                        );
                        if (await this.getWorkingService()) {
                            return await this.getSelectionDataFromAPI(data);
                        } else {
                            appStore.updateSnackbar(
                                'No service is available.',
                                'error',
                                5000,
                                true
                            );
                            return undefined;
                        }
                    }
                    selectionData = {
                        valid: apiData.valid,
                        eSF: this.featureModelSolo.features.filter(f => apiData.selection.includes(f.name)),
                        iSF: this.featureModelSolo.features.filter(f => apiData.impliedSelection.includes(f.name)),
                        eDF: this.featureModelSolo.features.filter(f => apiData.deselection.includes(f.name)),
                        iDF: this.featureModelSolo.features.filter(f => apiData.impliedDeselection.includes(f.name)),
                        uF: this.featureModelSolo.features.filter(f => !(apiData.selection.includes(f.name) || apiData.impliedSelection.includes(f.name) || apiData.deselection.includes(f.name) || apiData.impliedDeselection.includes(f.name))),
                        oPF: this.featureModelSolo.features.filter(f => apiData.openParents.includes(f.name)),
                        oCF: this.featureModelSolo.features.filter(f => apiData.openChildren.includes(f.name)),
                        nOF: this.featureModelSolo.features.filter(f => !apiData.openChildren.includes(f.name) || !apiData.openParents.includes(f.name))
                    }
                }
            }
            return selectionData;
        },

        async setStartService() {
            let result = await pingFL();
            if (result) {
                this.serviceIsFeatureIDE = false;
                this.serviceIsWorking = true;
                return;
            }

            result = await pingFIDE();
            if (result) {
                this.serviceIsFeatureIDE = true;
                this.serviceIsWorking = true;
            }
            return result;
        }
    },

    computed: {
        tr() {
            return tr;
        },

        Feature() {
            return Feature;
        },

        FeatureNodeConstraintItem() {
            return FeatureNodeConstraintItem;
        },

        SelectionState() {
            return SelectionState;
        },

        missingFeaturesOfSelectedVersion() {
            if (!this.featureModelSolo || !this.featureModelSolo.root) {
                return [];
            }

            return this.featureModelSolo.features
                .filter(f => f.selectionState === SelectionState.ExplicitlySelected || f.selectionState === SelectionState.ImplicitlySelected)
                .filter(f => !this.featureModelSolo.features.includes(f));
        },

        conflictingCTCsOfSelectedVersion() {
            if (!this.featureModelSolo || this.featureModelSolo.root) {
                return [];
            }

            return this.featureModelSolo.constraints.some(c => c.evaluate() === false);
        },
    }
};
</script>

<style scoped>

</style>
