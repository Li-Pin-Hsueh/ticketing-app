import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { OrderStatus, ExpirationCompleteEvent } from "@pintickets/common";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "Tourl",
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "onqw",
    ticket,
    expiresAt: new Date(),
  });
  await order.save();

  // Create fake data obj
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);
  console.log('Test: ', order.version);
  const updatedOrder = await Order.findById(order.id);
  console.log('Test: ', updatedOrder!.version);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
