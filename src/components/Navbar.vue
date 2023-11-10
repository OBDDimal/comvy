<template>
    <v-app-bar app>
        <v-app-bar-title style="flex: initial">
            <v-avatar class="hidden-xs-only mr-3">
                <v-img
                        :src="
                        theme.global.current.value.dark
                            ? '/ddueruem_logo_dark.svg'
                            : '/ddueruem_logo.svg'
                    "
                        alt="logo"
                />
            </v-avatar>
            variability.dev
        </v-app-bar-title>
        <div class="hidden-sm-and-down ml-5">
            <v-menu
                    open-on-hover
            >
                <template v-slot:activator="{ props }">
                    <v-btn
                            class="mx-1"
                            prepend-icon="mdi-menu"
                            v-bind="props"
                    >
                        File
                    </v-btn>
                </template>

                <v-list density='compact'>
                    <v-list-item prepend-icon="mdi-file-document-plus" title='Open Feature Model'
                                 @click='$emit("openFile")'>
                    </v-list-item>
                    <v-list-item v-if='properties.fileIsLoaded' prepend-icon="mdi-file-cog"
                                 title='Load Configuration' @click='$emit("openConf")'
                    >
                    </v-list-item>
                    <v-list-item v-if='properties.fileIsLoaded' prepend-icon="mdi-content-save"
                                 title='Save Configuration to Local Storage' @click='$emit("localStorage")'>
                    </v-list-item>
                    <v-list-item v-if='properties.fileIsLoaded' prepend-icon="mdi-download" title='Download Configuration'
                                 @click='$emit("download")'>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn
                    class="mx-1"
                    prepend-icon="mdi-reload"
                    @click='$emit("reset")'
            >
                Reset
            </v-btn>
            <v-btn
                    class="mx-1"
                    prepend-icon="mdi-undo"
                    :disabled="!properties.commandManager.isUndoAvailable()"
                    @click='properties.commandManager.undo()'
            >
                Undo
            </v-btn>
            <v-btn
                    class="mx-1"
                    prepend-icon="mdi-redo"
                    :disabled="!properties.commandManager.isRedoAvailable()"
                    @click='properties.commandManager.redo()'
            >
                Redo
            </v-btn>
            <v-menu
                    open-on-hover
            >
                <template v-slot:activator="{ props }">
                    <v-btn
                            :prepend-icon="properties.serviceIsWorking ? 'mdi-wifi' : 'mdi-wifi-off'"
                            class="mx-1"
                            v-bind="props"
                    >
                        Service
                    </v-btn>
                </template>
                <v-list density='compact'>
                    <v-list-item title='Use Flask Backend'>
                        <template v-slot:prepend>
                            <v-radio
                                    v-model="properties.serviceIsFlask"
                                    density="compact"
                                    @input='$emit("changeService", false)'
                            ></v-radio>
                        </template>
                    </v-list-item>
                    <v-list-item title='Use FeatureIDE Service'>
                        <template v-slot:prepend>
                            <v-radio
                                    v-model="properties.serviceIsFeatureIDE"
                                    density="compact"
                                    @input='$emit("changeService", true)'
                            ></v-radio>
                        </template>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <v-spacer></v-spacer>
        <div class="hidden-md-and-up">
            <v-btn
                    :icon="
                    theme.global.current.value.dark
                        ? 'mdi-brightness-7'
                        : 'mdi-brightness-4'
                "
                    @click="toggleTheme"
            >
            </v-btn>
            <v-btn v-fullscreen icon>
                <v-icon> mdi-fullscreen</v-icon>
            </v-btn>
            <v-btn
                    class="drawer-button"
                    icon="mdi-menu"
                    @click="drawer = !drawer"
            ></v-btn>
        </div>
        <div class="hidden-sm-and-down">
            <v-btn
                    :icon="
                    theme.global.current.value.dark
                        ? 'mdi-brightness-7'
                        : 'mdi-brightness-4'
                "
                    class="mx-3 theme-button"
                    @click="toggleTheme"
            >
            </v-btn>
            <v-btn
                    :class="breakpoints.smAndDown ? 'mr-3' : ''"
                    icon="mdi-fullscreen"
            >
            </v-btn>
        </div>
    </v-app-bar>
</template>

<script setup>
import {useDisplay, useTheme} from 'vuetify';
import {ref} from 'vue';

const breakpoints = useDisplay();
const theme = useTheme();
const drawer = ref(false);
const fileDrawer = ref(false)

const emit = defineEmits(['localStorage', 'download', 'openFile', 'openConf', 'reset', 'theme', 'changeService'])

const properties = defineProps({
    fileIsLoaded: Boolean,
    serviceIsWorking: Boolean,
    serviceIsFeatureIDE: Boolean,
    serviceIsFlask: Boolean,
    commandManager: undefined,
})

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark
        ? 'variabilityLightTheme'
        : 'variabilityDarkTheme';
    emit("theme")
}
</script>
