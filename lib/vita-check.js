'use babel';

import VitaCheckView from './vita-check-view';
import { CompositeDisposable } from 'atom';

export default {

  vitaCheckView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.vitaCheckView = new VitaCheckView(state.vitaCheckViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.vitaCheckView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'vita-check:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.vitaCheckView.destroy();
  },

  serialize() {
    return {
      vitaCheckViewState: this.vitaCheckView.serialize()
    };
  },

  toggle() {
    console.log('VitaCheck was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
