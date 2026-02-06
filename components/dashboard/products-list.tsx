"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Package,
    Search,
    AlertTriangle,
    Pencil,
    Trash2,
    Loader2,
} from "lucide-react";
import { ProductDialog } from "./product-dialog";

interface Product {
    id: number;
    name: string;
    description: string | null;
    cost_price: number;
    sale_price: number;
    stock: number;
    min_stock: number;
    category: string;
    is_active: boolean;
}

interface ProductsListProps {
    initialProducts: Product[];
}

const categoryLabels: Record<string, string> = {
    hair_product: "Cabello",
    beard_product: "Barba",
    tools: "Herramientas",
    consumables: "Consumibles",
    other: "Otro",
};

export function ProductsList({ initialProducts }: ProductsListProps) {
    const [products] = useState<Product[]>(initialProducts);
    const [search, setSearch] = useState("");
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
    );

    const lowStockProducts = products.filter(p => p.stock <= p.min_stock);

    const handleDelete = async () => {
        if (!deleteProduct) return;
        setDeleting(true);

        const supabase = createClient();
        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", deleteProduct.id);

        setDeleting(false);

        if (!error) {
            setDeleteProduct(null);
            window.location.reload();
        } else {
            alert("Error al eliminar producto: " + error.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <Card className="bg-orange-500/10 border-orange-500/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            <span className="font-semibold text-orange-500">Stock Bajo</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Los siguientes productos tienen stock bajo:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {lowStockProducts.map((p) => (
                                <Badge key={p.id} variant="outline" className="border-orange-500/50">
                                    {p.name} ({p.stock} unid.)
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Inventario ({products.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay productos en el inventario</p>
                            <p className="text-sm">Agrega tu primer producto</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead className="text-center">Stock</TableHead>
                                        <TableHead className="text-right">Costo</TableHead>
                                        <TableHead className="text-right">Venta</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => {
                                        const isLowStock = product.stock <= product.min_stock;

                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                                            <Package className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{product.name}</p>
                                                            {product.description && (
                                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                                    {product.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {categoryLabels[product.category] || product.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        className={isLowStock
                                                            ? "bg-orange-500/20 text-orange-500 border-orange-500/30"
                                                            : "bg-green-500/20 text-green-500 border-green-500/30"
                                                        }
                                                    >
                                                        {isLowStock && <AlertTriangle className="h-3 w-3 mr-1" />}
                                                        {product.stock}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    ${product.cost_price.toFixed(0)}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-green-500">
                                                    ${product.sale_price.toFixed(0)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <ProductDialog
                                                            mode="edit"
                                                            product={product}
                                                            trigger={
                                                                <Button variant="ghost" size="sm">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            }
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setDeleteProduct(product)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente{" "}
                            <strong>{deleteProduct?.name}</strong> del inventario.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
