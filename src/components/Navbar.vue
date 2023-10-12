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
            class = "mx-1"
            prepend-icon="mdi-menu"
            v-bind="props"
        >
          File
        </v-btn>
      </template>

      <v-list density='compact'>
            <v-list-item @click='$emit("openFile")' prepend-icon="mdi-file-document-plus" title='Open Feature Model'>
            </v-list-item>
            <v-list-item @click='$emit("openConf")' v-if='props.fileIsLoaded'
                prepend-icon="mdi-file-cog" title='Load Configuration'
            >
            </v-list-item>
            <v-list-item @click='$emit("localStorage")' v-if='props.fileIsLoaded' prepend-icon="mdi-content-save" title='Save Configuration to Local Storage'>
            </v-list-item>
            <v-list-item @click='$emit("download")' v-if='props.fileIsLoaded' prepend-icon="mdi-download" title='Download Configuration'>
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
                  @click='$emit("undo")'
            >
              Undo
            </v-btn>
            <v-btn
                  class="mx-1"
                  prepend-icon="mdi-redo"
                  @click='$emit("redo")'
            >
              Redo
            </v-btn>
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
            <v-btn icon v-fullscreen>
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
                class="mx-3 theme-button"
                :icon="
                    theme.global.current.value.dark
                        ? 'mdi-brightness-7'
                        : 'mdi-brightness-4'
                "
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
import { useDisplay, useTheme } from 'vuetify';
import { ref } from 'vue';

const breakpoints = useDisplay();
const theme = useTheme();
const drawer = ref(false);
const fileDrawer = ref(false)

const emit = defineEmits(['localStorage', 'download', 'openFile', 'openConf', 'reset', 'undo', 'redo'])

const props = defineProps({
  fileIsLoaded: Boolean,
})

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark
        ? 'light'
        : 'dark';
}
</script>
