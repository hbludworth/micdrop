import EventBus, { ACTIONS } from '../EventBus';

export interface SnackbarActions {
  onAction?: () => void;
  actionText?: string;
}
const showSnackbar = (text: string, options: SnackbarActions = {}): void => {
  EventBus.$emit(ACTIONS.TOAST, { text, ...options });
};

const closeSnackbar = (): void => {
  EventBus.$emit(ACTIONS.CLOSE_TOAST);
};

const showErrorSnackbar = async (text: string): Promise<void> => {
  EventBus.$emit(ACTIONS.TOAST, { text, error: true });
};
const globalActions = {
  showSnackbar,
  showErrorSnackbar,
  closeSnackbar,
};

export type GlobalActionsType = typeof globalActions;

export default globalActions;
