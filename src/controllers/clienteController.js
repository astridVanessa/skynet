import { clienteService } from "./services/clienteService.js";

export const clienteController = {
  getClientes: async (req, res) => {
    try {
      const clientes = await clienteService.listarClientes();
      res.json(clientes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los clientes" });
    }
  },

  addCliente: async (req, res) => {
    try {
      const id = await clienteService.agregarCliente(req.body);
      res.status(201).json({ message: "Cliente registrado con éxito", id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al registrar cliente" });
    }
  },
};
