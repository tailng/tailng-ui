import { Component } from '@angular/core';
import { ComponentAssistantComponent } from '../../../../../../../shared/demos/component-assistant/component-assistant.component';

@Component({
  selector: 'app-ai-chat-live-demo',
  imports: [ComponentAssistantComponent],
  template: '<app-component-assistant variant="full" />',
})
export class AiChatLiveDemoComponent {}
