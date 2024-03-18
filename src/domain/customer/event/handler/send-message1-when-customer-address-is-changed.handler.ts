import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChanged from "./customer-address-changed.event";

export default class SendMessage1WhenCustomerAddressIsChanged
  implements EventHandlerInterface<CustomerAddressChanged>
{
  handle(event: CustomerAddressChanged): void {
    console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.endereco}`); 
  }
}
