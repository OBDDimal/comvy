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
            <v-btn
                class="mx-1"
                prepend-icon="mdi-file"
                @click='fileDrawer = !fileDrawer'
            >
                File
            </v-btn>
            <v-btn
                  class="mx-1"
                  prepend-icon="mdi-reload"
                  @click='$emit("reset")'
            >
                Reset
            </v-btn>
            <v-btn
                  class="mx-1"
                  icon="mdi-undo"
                  @click='$emit("undo")'
            >
            </v-btn>
            <v-btn
                  class="mx-1"
                  icon="mdi-redo"
                  @click='$emit("redo")'
            >
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
                @click.stop="drawer = !drawer"
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
    <v-navigation-drawer
        class="mobile-navigation"
        v-model="fileDrawer"
        app
        temporary
    >
        <v-list>
            <v-list-item @click='$emit("openFile")'>
                <template v-slot:prepend>
                    <v-icon icon="mdi-file-document-plus"></v-icon>
                </template>
                <v-list-item-title>Open a new File</v-list-item-title>
            </v-list-item>
            <v-list-item @click='$emit("openConf")'>
                <template v-slot:prepend>
                    <v-icon icon="mdi-file-cog"></v-icon>
                </template>
                <v-list-item-title>Load Configuration</v-list-item-title>
            </v-list-item>
            <v-list-item @click='$emit("localStorage")'>
                <template v-slot:prepend>
                    <v-icon icon="mdi-content-save"></v-icon>
                </template>
                <v-list-item-title>Save to Local Storage</v-list-item-title>
            </v-list-item>
            <v-list-item @click='$emit("download")'>
                <template v-slot:prepend>
                    <v-icon icon="mdi-download"></v-icon>
                </template>
                <v-list-item-title>Download Configuration</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
        class="mobile-navigation"
        v-model="drawer"
        app
        temporary
    >
        <v-list>
            <v-list-item link to="/">
                <template v-slot:prepend>
                    <v-icon icon="mdi-home"></v-icon>
                </template>
                <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
            <v-list-item class="mobile-theme-button" link @click="toggleTheme">
                <template v-slot:prepend>
                    <v-icon
                        :icon="
                            theme.global.current.value.dark
                                ? 'mdi-brightness-7'
                                : 'mdi-brightness-4'
                        "
                    ></v-icon>
                </template>
                <v-list-item-title>Switch theme</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { useDisplay, useTheme } from 'vuetify';
import { ref } from 'vue';

const breakpoints = useDisplay();
const theme = useTheme();
const drawer = ref(false);
const fileDrawer = ref(false)

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark
        ? 'light'
        : 'dark';
}
</script>
