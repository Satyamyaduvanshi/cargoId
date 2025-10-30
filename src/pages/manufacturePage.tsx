import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, useRef } from "react";
import Button from "../components/UI/Button";
import { getProgram } from "../utility/AnchorProvider";
import { web3 } from "@project-serum/anchor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductQRCode from "../components/ProductQRCode";
import { sendProductRegistrationEmail } from "../utility/emailService";
import { PROGRAM_ID } from "../idl/supplychain";
import { ArrowRight, Check } from "lucide-react";
import { gsap } from "gsap";

const ManufacturePage = () => {
  const wallet = useWallet();
  const [name, setName] = useState("");
  const [make, setMake] = useState("");
  const [location, setLocation] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [updaterAddress, setUpdaterAddress] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registeredProductId, setRegisteredProductId] = useState<string | null>(null);
  
  const imageRef = useRef(null);
  
  useEffect(() => {
    // Animate the image from right side
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  // Add a function to handle copying the product address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Show success toast
        toast.success('Address copied to clipboard!', {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { background: "#d4edda", color: "#155724" },
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const handleRegister = async () => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        setError("Please connect your wallet first.");
        return;
      }

      if (!name.trim() || !make.trim() || !location.trim() || !customerEmail.trim() || !updaterAddress.trim()) {
        setError("Please fill in all required fields.");
        return;
      }

      if (!customerEmail.includes('@')) {
        setError("Please enter a valid email address.");
        return;
      }

      // Validate the updater address
      let updaterPublicKey;
      try {
        updaterPublicKey = new web3.PublicKey(updaterAddress);
      } catch (err) {
        setError("Invalid updater address. Please enter a valid Solana address.");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        // Get the program only
        const { program } = await getProgram(wallet);
        
        // Calculate the PDA for the product
        const [productPDA] = await web3.PublicKey.findProgramAddress(
          [
            Buffer.from("product"),
            wallet.publicKey.toBuffer(),
            Buffer.from(name)
          ],
          PROGRAM_ID
        );
        
        console.log("Using product PDA:", productPDA.toString());
        
        try {
          // Call the registerProduct instruction directly
          const signature = await (program.methods as any)
            .registerProduct(name, location)
            .accounts({
              product: productPDA,
              manufacturer: wallet.publicKey,
              updater: updaterPublicKey,
              systemProgram: web3.SystemProgram.programId,
            })
            .rpc();
          
          console.log("Product registered successfully:", signature);
          
          // Store the product name and address in localStorage for future reference
          const productRegistry = JSON.parse(localStorage.getItem('productRegistry') || '{}');
          productRegistry[name] = productPDA.toString();
          localStorage.setItem('productRegistry', JSON.stringify(productRegistry));

          // Create a shareable link for this product
          const productLink = `${window.location.origin}/verify?address=${productPDA.toString()}`;

          // Send email notification
          try {
            const emailResult = await sendProductRegistrationEmail({
              to_email: customerEmail,
              product_name: name,
              product_make: make,
              product_id: productPDA.toString(),
              verification_link: productLink
            });
            
            if (emailResult.status === 'skipped') {
              console.log("Email sending skipped:", emailResult.text);
            } else if (emailResult.status === 'error') {
              console.log("Email sending failed but product was registered successfully");
            } else {
              console.log("Email sent successfully");
            }
          } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Don't fail the registration if email fails
          }

          setRegisteredProductId(productPDA.toString());

          toast.success(
            <div>
              <div>✅ Product registered successfully!</div>
              <div className="mt-2 text-xs font-semibold">Product Address:</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono break-all">{productPDA.toString()}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent toast from closing
                    copyToClipboard(productPDA.toString());
                  }}
                  className="p-1 bg-green-100 hover:bg-green-200 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              <div className="mt-2 text-xs">
                <a 
                  href={productLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-800 underline hover:text-blue-900"
                >
                  View Product
                </a>
              </div>
            </div>,
            {
              position: "bottom-right",
              autoClose: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              style: { background: "#d4edda", color: "#155724" },
              className: 'mt-4 mr-4',
            }
          );
          
          setName("");
          setMake("");
          setLocation("");
          setCustomerEmail("");
          setUpdaterAddress("");
          setError("");
        } catch (txError) {
          console.error("Transaction error:", txError);
          setError(`Transaction failed: ${txError instanceof Error ? txError.message : String(txError)}`);
        }
      } catch (err) {
        console.error("❌ Registration failed:", err);
        setError(`Product registration failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    } catch (err) {
      console.error("❌ Registration failed:", err);
      setError(`Product registration failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (registeredProductId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-xl w-full max-w-md border-t-4 border-primary">
          <div className="flex items-center justify-center mb-4 sm:mb-6 text-primary">
            <Check size={36} className="mr-2 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">Success!</h1>
          </div>
          <div className="mb-6 flex justify-center">
            <ProductQRCode productId={registeredProductId} />
          </div>
          <Button
            onClick={() => setRegisteredProductId(null)}
            text="Register Another Product"
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
      <div className="w-full lg:w-1/3 flex items-center justify-center mb-8 lg:mb-0 lg:pr-8">
        <div className="w-full flex justify-center items-center">
          <img
            ref={imageRef}
            src="/boxs.png"
            alt="Product Visual"
            className="w-auto h-auto max-w-full max-h-[400px] object-contain animate-float"
            style={{ 
              filter: "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))"
            }}
          />
        </div>
      </div>

      <div className="w-full lg:w-2/3 mb-8 lg:mb-0">
        <div className="p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-md w-full max-w-md mx-auto border-t-4 border-primary">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gray-800">Register Product</h1>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 text-center">Create a new product entry on the blockchain supply chain</p>

          <div className="space-y-4 md:space-y-5">
            <div>
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm md:text-base"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Product Make/Brand"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm md:text-base"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Origin Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm md:text-base"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Updater Address (Solana Public Key)"
                value={updaterAddress}
                onChange={(e) => setUpdaterAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm md:text-base"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Customer Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm md:text-base"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 md:mt-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
              <p className="text-sm md:text-base">{error}</p>
            </div>
          )}

          <Button
            onClick={handleRegister}
            text={isLoading ? "Registering..." : (wallet.connected ? "Register Product" : "Connect Wallet to Register")}
            variant="primary"
            disabled={isLoading}
            className="w-full mt-4 md:mt-6 py-2.5 md:py-3 flex items-center justify-center gap-2 text-sm md:text-base"
            leftIcon={<ArrowRight size={16} className="flex-shrink-0" />}
          />
          
          <p className="text-xs md:text-sm text-gray-500 mt-4 text-center">
            Once registered, a unique blockchain address will be generated for your product
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManufacturePage;

