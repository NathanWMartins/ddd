import Customer from "../../customer/entity/customer";
import CustomerCreatedEvent from "../../customer/event/handler/customer-created.event";
import SendMessage1WhenCustomerAddressIsChanged from "../../customer/event/handler/send-message1-when-customer-address-is-changed.handler";
import SendMessage1WhenCustomerIsCreated from "../../customer/event/handler/send-message1-when-customer-is-created.handler";
import SendMessage2WhenCustomerIsCreated from "../../customer/event/handler/send-message2-when-customer-is-created.handler";
import Address from "../../customer/value-object/address";
import ProductCreatedEvent from "../../product/event/handler/product-created.event";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventDispatcher2 = new EventDispatcher();
    const eventHandler = new SendMessage1WhenCustomerIsCreated();
    const eventHandler2 = new SendMessage2WhenCustomerIsCreated();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");    
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");  

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "123",
      name: "Customer 1",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();

    //second message
    eventDispatcher2.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher2.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler2);

    eventDispatcher2.notify(customerCreatedEvent);

    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should notify when customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendMessage1WhenCustomerAddressIsChanged();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");    
  
    eventDispatcher.register("CustomerAddressChanged", eventHandler);
  
    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChanged"][0]
    ).toMatchObject(eventHandler);
  
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
  
    customer.changeAddress(new Address("Street 2", 2, "Zipcode 2", "City 2"));
  
    const customerAddressChangedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
      address: customer.Address,
    });
  
    eventDispatcher.notify(customerAddressChangedEvent);
    expect(spyEventHandler).toHaveBeenCalled();
  });
});

