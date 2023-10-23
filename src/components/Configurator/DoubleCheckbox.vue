<template>
  <div v-if='selectionItem'>
    <v-layout row>

       <v-tooltip location="bottom" >
        <template v-slot:activator="{ props }">
          <v-checkbox
              hide-details
              v-model="trueCheckBox"
              :style="BackgroundColor"
              style="display: inline;"
              :model-value="selectionItem.selectionState === SelectionState.ImplicitlySelected || selectionItem.selectionState === SelectionState.ExplicitlySelected"
              :disabled="selectionItem.selectionState !== SelectionState.Unselected && selectionItem.selectionState !== SelectionState.ExplicitlySelected"
              @input="selectFeature"
              :color="Color"
              v-bind="props"
              density="compact"
          ></v-checkbox>
        </template>
        <span v-if="selectionItem.selectionState === SelectionState.Unselected">Select explicitly</span>
        <span v-else-if="selectionItem.selectionState === SelectionState.ImplicitlySelected">Implicitly selected.</span>
        <span v-else-if="selectionItem.selectionState === SelectionState.ImplicitlyDeselected">Implicitly deselected</span>
        <span
            v-else-if="selectionItem.selectionState === SelectionState.ExplicitlySelected">Explicitly selected</span>
        <span v-else-if="selectionItem.selectionState === SelectionState.ExplicitlyDeselected">Explicitly deselected</span>
      </v-tooltip>

      <v-tooltip location="bottom" >
        <template v-slot:activator="{ props }">
          <v-checkbox
              hide-details
              :style="BackgroundColor"
              true-icon="mdi-close-box"
              v-model="falseCheckBox"
              :model-value="selectionItem.selectionState === SelectionState.ImplicitlyDeselected || selectionItem.selectionState === SelectionState.ExplicitlyDeselected"
              :disabled="selectionItem.selectionState !== SelectionState.Unselected && selectionItem.selectionState !== SelectionState.ExplicitlyDeselected"
              @input="deselectFeature"
              :color="Color"
              v-bind="props"
              density="compact"
          ></v-checkbox>

        </template>
        <span v-if="selectionItem.selectionState === SelectionState.Unselected">Deselect explicitly</span>
        <span v-else-if="selectionItem.selectionState === SelectionState.ImplicitlySelected">Implicitly selected</span>
        <span v-else-if="selectionItem.selectionState === SelectionState.ImplicitlyDeselected">Implicitly deselected.</span>
        <span v-else-if="selectionItem.selectionState === SelectionState.ExplicitlySelected">Explicitly selected</span>
        <span v-else-if="selectionItem.selectionState === SelectionState.ExplicitlyDeselected">Explicitly deselected</span>
      </v-tooltip>
    </v-layout>
  </div>
</template>

<script>
import { SelectionState } from '@/classes/Configurator/SelectionState';
import {variabilityDarkTheme, variabilityLightTheme} from "@/plugins/vuetify";

export default {
  name: 'DoubleCheckbox',

  computed: {
    SelectionState() {
      return SelectionState;
    },

      Color() {
        const dark = this.$vuetify.theme.global.current.dark;
        if (this.selectionItem.open) {
            return dark ? variabilityDarkTheme.colors["should-select"] : variabilityLightTheme.colors["should-select"];
        } else if (this.selectionItem.open !== null) {
            return dark ? variabilityDarkTheme.colors["should-select-parent"] : variabilityLightTheme.colors["should-select-parent"];
        } else if (this.selectionItem.selectionState === SelectionState.ExplicitlySelected) {
            return dark ? variabilityDarkTheme.colors.selected : variabilityLightTheme.colors.selected;
        } else if (this.selectionItem.selectionState === SelectionState.ImplicitlyDeselected) {
            return dark ? variabilityDarkTheme.colors["imp-deselected"] : variabilityLightTheme.colors["imp-deselected"];
        } else if (this.selectionItem.selectionState === SelectionState.ExplicitlyDeselected) {
            return dark ? variabilityDarkTheme.colors.deselected : variabilityLightTheme.colors.deselected;
        } else if (this.selectionItem.selectionState === SelectionState.ImplicitlySelected) {
            return dark ? variabilityDarkTheme.colors["imp-selected"] : variabilityLightTheme.colors["imp-selected"];
        } else {
            return dark ? variabilityLightTheme.colors.background : variabilityDarkTheme.colors.background;
        }
      },

      BackgroundColor() {
        return {
            "color": this.Color
        }

      }
  },

  data: () => ({
    trueCheckBox: false,
    falseCheckBox: false,
  }),

  props: {
    selectionItem: undefined
  },

  methods: {
    selectFeature() {
      if (this.trueCheckBox){
        this.$emit('select', SelectionState.ExplicitlySelected)
      } else {
        this.$emit('select', SelectionState.Unselected)
      }
    },

    deselectFeature() {
      if (this.falseCheckBox){
        this.$emit('select', SelectionState.ExplicitlyDeselected)
      } else {
        this.$emit('select', SelectionState.Unselected)
      }
    }
  },
};
</script>

<style scoped>
</style>
