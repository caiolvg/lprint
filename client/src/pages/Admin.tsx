import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/use-admin-products";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import type { Product } from "@shared/schema";

const CATEGORIES = ["Equipamento", "Móveis", "Vestuário", "Brinquedos"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  imageUrls: "",
  category: CATEGORIES[0],
  featured: false,
};

type FormState = typeof emptyForm;

function parseForm(form: FormState) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Math.round(parseFloat(form.price) * 100),
    imageUrls: form.imageUrls
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    category: form.category,
    featured: form.featured,
  };
}

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    description: p.description,
    price: (p.price / 100).toFixed(2),
    imageUrls: p.imageUrls.join("\n"),
    category: p.category,
    featured: p.featured,
  };
}

export default function Admin() {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const isSaving = createProduct.isPending || updateProduct.isPending;
  const isDeleting = deleteProduct.isPending;

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm(productToForm(product));
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = parseForm(form);
    if (
      !data.name ||
      !data.description ||
      !data.imageUrls.length ||
      data.price <= 0
    ) {
      toast({
        title: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, data });
        toast({ title: "Produto atualizado!" });
      } else {
        await createProduct.mutateAsync(data);
        toast({ title: "Produto criado!" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({
        title: err?.message ?? "Erro ao salvar",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(product: Product) {
    try {
      await deleteProduct.mutateAsync(product.id);
      toast({ title: "Produto excluído." });
      setDeleteConfirm(null);
    } catch (err: any) {
      toast({
        title: err?.message ?? "Erro ao excluir",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel Admin</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os produtos do catálogo
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Novo Produto
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Produto</th>
                  <th className="text-left px-4 py-3 font-medium">Categoria</th>
                  <th className="text-left px-4 py-3 font-medium">Preço</th>
                  <th className="text-left px-4 py-3 font-medium">Destaque</th>
                  <th className="text-right px-4 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.imageUrls[0] && (
                          <img
                            src={p.imageUrls[0]}
                            alt={p.name}
                            className="h-10 w-10 rounded-md object-cover shrink-0"
                          />
                        )}
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{p.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {(p.price / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {p.featured ? (
                        <Badge>Sim</Badge>
                      ) : (
                        <span className="text-muted-foreground">Não</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(p)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirm(p)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                Nenhum produto encontrado.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Nome do produto"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Descrição do produto"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category">Categoria *</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="imageUrls">
                URLs das Imagens * (uma por linha)
              </Label>
              <Textarea
                id="imageUrls"
                value={form.imageUrls}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrls: e.target.value }))
                }
                placeholder="https://exemplo.com/imagem1.jpg&#10;https://exemplo.com/imagem2.jpg"
                rows={3}
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
              />
              <Label htmlFor="featured">Produto em destaque</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editing ? "Salvar alterações" : "Criar produto"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir produto?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm mt-1">
            Tem certeza que deseja excluir{" "}
            <strong>{deleteConfirm?.name}</strong>? Esta ação não pode ser
            desfeita.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={isDeleting}
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
