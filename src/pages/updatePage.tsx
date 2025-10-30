import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Button from "../components/UI/Button";
import { getProgram, getAllProducts } from "../utility/AnchorProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  RotateCw, ArrowRightCircle, CheckCircle } from "lucide-react";

interface Product {
  address: string;
  id: string;
  manufacturer: string;
  updater: string;
  location: string;
  delivered: boolean;
  createdAt: number;
  statusLogs: any[];
}

const UpdatePage = () => {
  const wallet = useWallet();
  const { publicKey, connect, signTransaction } = wallet;
  const [productName, setProductName] = useState("");
  const [productAddress, setProductAddress] = useState("");
  const [location, setLocation] = useState("");
  const [delivered, setDelivered] = useState(false);
  const [error, setError] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Load all products from the blockchain when the component mounts
  useEffect(() => {
    if (publicKey) {
      loadProducts();
    }
  }, [publicKey]);
  
  const loadProducts = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const walletAdapter = {
        publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      };
      
      const products = await getAllProducts(walletAdapter);
      
      // Filter products where current wallet is the updater
      const updaterProducts = products.filter(p => p.updater === publicKey.toString());
      
      setAllProducts(updaterProducts);
      console.log("Loaded products where you are the updater:", updaterProducts);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Auto-fill the product address when a product is selected
  useEffect(() => {
    const product = allProducts.find(p => p.id === productName);
    if (product) {
      setProductAddress(product.address);
      setLocation(product.location);
      setDelivered(product.delivered);
    }
  }, [productName, allProducts]);

  const handleUpdate = async () => {
    setError("");
    
    if (!publicKey) {
      await connect();
      return;
    }

    if (!productAddress.trim() || !location.trim()) {
      setError("Please provide both Product Address and Location.");
      return;
    }

    setLoading(true);
    try {
      const walletAdapter = {
        publicKey,
        signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      };

      const { program } = await getProgram(walletAdapter);

      try {
        // Use the product address directly
        const productPublicKey = new PublicKey(productAddress);
        
        console.log("Updating product at address:", productPublicKey.toString());

        try {
          // Try to fetch the product account first to verify it exists
          const productAccount = await program.account.product.fetch(productPublicKey);
          console.log("Found product:", productAccount);

          // Check if the connected wallet is the authorized updater
          if (!productAccount.updater.equals(publicKey)) {
            setError("You are not authorized to update this product. Only the designated updater can update the product status.");
            setLoading(false);
            return;
          }

          // If we got here, the product exists and the user is authorized to update it
          await (program.methods as any)
            .updateProduct(location, delivered)
            .accounts({
              product: productPublicKey,
              updater: publicKey,
            })
            .rpc();

          toast.success(`✅ Product updated to location: "${location}" ${delivered ? "(Delivered)" : "(In Transit)"}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { background: "#d4edda", color: "#155724" },
            className: 'mt-4 mr-4',
          });

          setUpdateSuccess(true);
          
          // Reload the products after update
          await loadProducts();
          
        } catch (fetchErr: any) {
          console.error("Error fetching or updating product:", fetchErr);
          
          if (fetchErr.toString().includes("AccountNotInitialized") || 
              fetchErr.toString().includes("Account does not exist")) {
            setError(
              "Product not found at this address. Please check that:\n" +
              "1. You've entered the correct product address\n" +
              "2. The product has been registered on this network (devnet)\n" +
              "3. The account hasn't been closed"
            );
          } else if (fetchErr.toString().includes("UnauthorizedUpdater")) {
            setError("You are not authorized to update this product. Only the designated updater can update the product status.");
          } else {
            setError(`Error: ${fetchErr.message || 'Unknown error occurred'}`);
          }
        }
      } catch (err) {
        console.error("Error with product address:", err);
        setError("Invalid product address. Please provide a valid Solana address.");
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
      setError("Product update failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (updateSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-xl w-full max-w-md border-t-4 border-green-500">
          <div className="flex items-center justify-center mb-4 sm:mb-6 text-green-600">
            <CheckCircle size={36} className="mr-2 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">Success!</h1>
          </div>
          <p className="text-center mb-6 text-sm sm:text-base">
            The product has been successfully updated with the new location and delivery status.
          </p>
          <Button
            onClick={() => {
              setUpdateSuccess(false);
              setProductName("");
              setProductAddress("");
              setLocation("");
              setDelivered(false);
            }}
            text="Update Another Product"
            variant="primary"
            className="w-full"
          />
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row-reverse items-center justify-center min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:gap-12">
      {/* Left side with image */}
      <div className="w-full lg:w-1/3 flex items-center justify-center mb-8 lg:mb-0 lg:pr-8">
        <div className="w-full flex justify-center items-center">
          <img
            src="/update.png"
            alt="Update Product Visual"
            className="w-auto h-auto max-w-full max-h-[400px] object-contain animate-float"
            style={{ 
              filter: "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))"
            }}
          />
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-2/3 mb-8 lg:mb-0">
        <div className="p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-md w-full max-w-md mx-auto border-t-4 border-primary">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gray-800">Update Product</h1>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 text-center">Update product location and delivery status on the blockchain</p>

          <div className="space-y-4 md:space-y-5">
            {allProducts.length > 0 ? (
              <div>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none bg-white text-sm md:text-base"
                >
                  <option value="">Select a product to update...</option>
                  {allProducts.map((product) => (
                    <option key={product.address} value={product.id} className="truncate">
                      {product.id}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded-r-md">
                <p className="text-sm md:text-base">
                  No products found where you are the authorized updater. You can only update products where your wallet address has been designated as the updater.
                </p>
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Product Address"
                value={productAddress}
                onChange={(e) => setProductAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm md:text-base"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Current Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm md:text-base"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="delivered"
                checked={delivered}
                onChange={(e) => setDelivered(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="delivered" className="ml-2 text-sm md:text-base text-gray-700">
                Mark as Delivered
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-4 md:mt-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
              <p className="whitespace-pre-line text-sm md:text-base">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-6">
            <Button
              onClick={handleUpdate}
              text={loading ? "Updating..." : "Update Product"}
              variant="primary"
              disabled={loading}
              leftIcon={<ArrowRightCircle size={16} className="flex-shrink-0" />}
              className="w-full sm:flex-1 py-2.5 md:py-3 text-sm md:text-base"
            />
            
            <Button
              onClick={loadProducts}
              text="Refresh"
              variant="secondary"
              disabled={loading}
              leftIcon={<RotateCw size={14} className="flex-shrink-0" />}
              className="w-full sm:w-auto py-2.5 md:py-3 text-sm md:text-base"
            />
          </div>
          
          <p className="text-xs md:text-sm text-gray-500 mt-4 text-center">
            Only the designated updater can update product information
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdatePage;
