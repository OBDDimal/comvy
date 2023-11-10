export const SelectionState = {
    Unselected: 'Unselected',
    ImplicitlySelected: 'ImplicitlySelected',
    ImplicitlyDeselected: 'ImplicitlyDeselected',
    ExplicitlySelected: 'ExplicitlySelected',
    ExplicitlyDeselected: 'ExplicitlyDeselected'
}

export function SelectionStateValidator(Parent, Child) {
    if (Parent === SelectionState.ExplicitlyDeselected || Parent === SelectionState.ImplicitlyDeselected) {
        return !(Child === SelectionState.ExplicitlySelected || Child === SelectionState.ImplicitlySelected);
    }
    return true;
}
