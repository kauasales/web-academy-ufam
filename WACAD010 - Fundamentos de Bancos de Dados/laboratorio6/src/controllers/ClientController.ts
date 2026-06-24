import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ClientController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { rg, nome, sexo, fone } = req.body;

      if (!rg || !nome || !sexo || !fone) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
      }

      const clientExists = await prisma.cliente.findUnique({ where: { rg } });
      if (clientExists) {
        return res.status(400).json({ error: "Cliente com este RG já cadastrado." });
      }

      const newClient = await prisma.cliente.create({
        data: { rg, nome, sexo, fone },
      });

      return res.status(201).json(newClient);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const clients = await prisma.cliente.findMany();
      return res.json(clients);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar clientes." });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const rg = req.params.rg as string;
      const { nome, sexo, fone } = req.body;

      const updatedClient = await prisma.cliente.update({
        where: { rg },
        data: { nome, sexo, fone },
      });

      return res.json(updatedClient);
    } catch (error) {
      return res.status(404).json({ error: "Cliente não encontrado ou erro na atualização." });
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const rg = req.params.rg as string;

      await prisma.cliente.delete({ where: { rg } });
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: "Cliente não encontrado ou possui dependências ativas." });
    }
  }
}