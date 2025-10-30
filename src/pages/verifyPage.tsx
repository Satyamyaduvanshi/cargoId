import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { web3 } from "@project-serum/anchor";
import Button from "../components/UI/Button";
import { getProgram, getAllProducts } from "../utility/AnchorProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, CheckCircle, AlertCircle } from "lucide-react";

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

const VerifyPage = () => {
  const wallet = useWallet();
  const { publicKey, connect, signTransaction } = wallet;
  const [productName, setProductName] = useState("");
  const [productAddress, setProductAddress] = useState("");
  const [productInfo, setProductInfo] = useState<any>(null);
  const [error, setError] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Load all products from the blockchain when the component mounts
  useEffect(() => {
    if (publicKey) {
      loadProducts();
      
      // Check for address in URL query parameters
      const params = new URLSearchParams(window.location.search);
      const addressParam = params.get('address');
      
      if (addressParam) {
        setProductAddress(addressParam);
        // Auto-verify if address is in URL
        handleVerifyWithAddress(addressParam);
      }
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
      setAllProducts(products);
      console.log("Loaded products:", products);
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
    }
  }, [productName, allProducts]);

  // Function to verify a product with a specific address
  const handleVerifyWithAddress = async (address: string) => {
    if (!publicKey || !address) return;
    
    setError("");
    setProductInfo(null);
    setSearched(true);
    setLoading(true);
    
    try {
      const walletAdapter = {
        publicKey,
        signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      };

      const { program } = await getProgram(walletAdapter);
      
      try {
        // Directly use the provided product address
        const productPublicKey = new web3.PublicKey(address);
        
        console.log("Looking for product at address:", productPublicKey.toString());

        try {
          // Call the verifyProduct instruction
          await (program.methods as any)
            .verifyProduct()
            .accounts({
              product: productPublicKey,
            })
            .rpc();
          
          // Fetch the product data
          const productAccount = await program.account.product.fetch(productPublicKey);
          console.log("Found product:", productAccount);

          setProductInfo(productAccount);
          
          toast.success(`✅ Product verified successfully!`, {
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
        } catch (fetchErr) {
          console.error("Error fetching product:", fetchErr);
          setError("Wrong product ID");
        }
      } catch (err) {
        console.error("Error with address format:", err);
        setError("Invalid product address format. Please provide a valid Solana address.");
      }
    } catch (err) {
      console.error("❌ Verification failed:", err);
      setError("Product verification failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setProductInfo(null);

    if (!publicKey) {
      await connect();
      return;
    }

    if (!productAddress.trim()) {
      setSearched(true);
      setError("Please enter a valid Product Address.");
      return;
    }

    await handleVerifyWithAddress(productAddress);
  };

  return (
    <div className="flex flex-col lg:flex-row-reverse items-center justify-center min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:gap-12">
      {/* Left side with verification form - takes full width on mobile, half on large screens */}
      <div className="w-full lg:w-1/2 flex items-center justify-center mb-8 lg:mb-0 lg:pr-10">
        {!searched || (!productInfo && !error) ? (
          <div className="w-full flex justify-center items-center">
            <img
              src="/man.png"
              alt="Verification Visual"
              className="w-auto h-auto max-w-full max-h-[400px] object-contain animate-float"
              style={{ 
                filter: "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))"
              }}
            />
          </div>
        ) : productInfo ? (
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-lg border-t-4 border-green-500">
              <div className="flex items-center mb-4 md:mb-6 text-green-600">
                <CheckCircle size={28} className="mr-2 md:mr-3 flex-shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold">Product Verified</h2>
              </div>
              
              <div className="mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-1">
                  <span className="text-sm font-semibold text-gray-500">Product ID</span>
                  <span className="font-medium text-sm md:text-base w-full sm:w-auto sm:max-w-[70%] text-left sm:text-right break-words">{productInfo.productId}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-1">
                  <span className="text-sm font-semibold text-gray-500">Manufacturer</span>
                  <span className="font-mono text-xs w-full sm:w-auto sm:max-w-[70%] text-left sm:text-right break-all">{productInfo.manufacturer.toBase58()}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-1">
                  <span className="text-sm font-semibold text-gray-500">Updater</span>
                  <span className="font-mono text-xs w-full sm:w-auto sm:max-w-[70%] text-left sm:text-right break-all">{productInfo.updater.toBase58()}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-1">
                  <span className="text-sm font-semibold text-gray-500">Location</span>
                  <span className="text-sm md:text-base">{productInfo.location}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-gray-500">Status</span>
                  <span className={`font-medium text-sm md:text-base ${productInfo.delivered ? "text-green-600" : "text-blue-600"}`}>
                    {productInfo.delivered ? "Delivered ✓" : "In Transit"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm md:max-w-md p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-lg border-t-4 border-red-500">
            <div className="flex items-center mb-4 md:mb-6 text-red-600">
              <AlertCircle size={28} className="mr-2 md:mr-3 flex-shrink-0" />
              <h2 className="text-xl md:text-2xl font-bold">Verification Failed</h2>
            </div>
            <p className="text-red-600 mb-4 text-sm md:text-base">{error}</p>
            <Button
              onClick={() => {
                setSearched(false);
                setError("");
              }}
              text="Try Again"
              variant="primary"
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Right side with search form - takes full width on mobile, half on large screens */}
      <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
        <div className="p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-md w-full max-w-md mx-auto border-t-4 border-primary">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gray-800">Track Product</h1>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 text-center">Verify authenticity and track product journey</p>

          <div className="space-y-4 md:space-y-5">
            {allProducts.length > 0 && (
              <div>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none bg-white text-sm md:text-base"
                >
                  <option value="">Select a registered product...</option>
                  {allProducts.map((product) => (
                    <option key={product.address} value={product.id} className="truncate">
                      {product.id}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Enter Product Address"
                value={productAddress}
                onChange={(e) => setProductAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm md:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-6">
            <Button
              onClick={handleVerify}
              text={loading ? "Searching..." : "Verify & Track"}
              variant="primary"
              disabled={loading}
              className="w-full sm:flex-1 py-2.5 md:py-3 text-sm md:text-base"
              leftIcon={<Search size={16} className="flex-shrink-0" />}
            />
            
            <Button
              onClick={loadProducts}
              text="Refresh"
              variant="secondary"
              disabled={loading}
              className="w-full sm:w-auto py-2.5 md:py-3 text-sm md:text-base"
            />
          </div>
          
          <p className="text-xs md:text-sm text-gray-500 mt-4 text-center">
            Enter a product address or select from the dropdown to verify authenticity
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VerifyPage;
