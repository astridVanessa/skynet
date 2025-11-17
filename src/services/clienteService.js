import { Cliente } from "../models/Clientes.js";

export const clienteService = {
  listarClientes: async () => {
    return await Cliente.getAll();
  },
  agregarCliente: async (data) => {
    return await Cliente.create(data);
  },
};
