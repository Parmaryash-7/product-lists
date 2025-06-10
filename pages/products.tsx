import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/products.module.css";
import { Suspense, useMemo } from "react";
import { useRouter } from "next/router";

type Product = {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    category: string;
};

type Props = {
    categories: string[];
    products: Product[];
};

export function getStaticProps() {
    return Promise.all([
        fetch("https://dummyjson.com/products?limit=250").then((res) => res.json()),
        fetch("https://dummyjson.com/products/category-list").then((res) =>
            res.json()
        ),
    ]).then(([productsData, categories]) => ({
        props: {
            products: productsData.products,
            categories,
        },
    }));
}

export default function ProductsPage({ categories, products }: Props) {
    const router = useRouter();
    const selectedCategory = (router.query.category as string) || "";
    const search = (router.query.search as string) || "";

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        if (search) {
            filtered = filtered.filter((product) =>
                product.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((product) =>
                product.category.includes(selectedCategory)
            );
        }

        return filtered;
    }, [selectedCategory, products, search]);

    return (
        <>
            <Head>
                <title>Products List</title>
                <meta name="description" content="Products List with static export" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.products_wrapper}>

                <ul className={styles.products_grid}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.slice(0, 30).map((product) => (
                            <div key={product.id} className={styles.shadow_wrapper}>
                                <Link
                                    href={`/product/${product.id}`}
                                    className={styles.product_card}
                                >
                                    <div className={styles.card_image}>
                                        {/* <Suspense */}
                                            {/* fallback={<div className={styles.image_loader} />} */}
                                        {/* > */}
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                width={200}
                                                height={200}
                                                className={styles.thumbnail}
                                            />
                                        {/* </Suspense> */}
                                    </div>
                                    <div className={styles.card_text}>
                                        <div className={styles.card_head}>
                                            <h1 className={styles.title}>{product.title}</h1>
                                        </div>
                                        <div className={styles.card_body}>
                                            <h3 className={styles.product_price}>${product.price}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <h1>No products found.</h1>
                    )}
                </ul>
            </div>
        </>
    );
}