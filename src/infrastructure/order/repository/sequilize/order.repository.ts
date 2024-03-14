import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customerid: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Order>{
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [OrderItemModel] // Certifique-se de que o nome do modelo de itens de pedido está correto aqui
    });
    return new Order(orderModel.id, orderModel.customer_id, orderModel.items.map((item) => 
    new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)));
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: [OrderItemModel] });
    return orderModels.map((orderModel) => 
      new Order(orderModel.id, orderModel.customer_id, orderModel.items.map((item) => 
      new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
    ));
  }
}
