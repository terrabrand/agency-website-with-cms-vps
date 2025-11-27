import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, Wallet, Globe, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (gateway: string, transactionId: string) => void;
  amountTZS: number;
  email: string;
  name: string;
  title: string;
  description: string;
  flutterwavePublicKey: string;
  paypalClientId: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amountTZS,
  email,
  name,
  title,
  description,
  flutterwavePublicKey,
  paypalClientId
}) => {
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [isSdkLoading, setIsSdkLoading] = useState(false);

  // Constants
  const EXCHANGE_RATE = 2600; // Mock rate: 1 USD = 2600 TZS
  const amountUSD = (amountTZS / EXCHANGE_RATE).toFixed(2);

  useEffect(() => {
    if (isOpen) {
      setSelectedGateway(null);
      setIsSdkLoading(false);
    }
  }, [isOpen]);

  // Handle PayPal Button Rendering
  useEffect(() => {
    if (isOpen && selectedGateway === 'paypal') {
        const clientId = paypalClientId || 'test';
        const scriptId = 'paypal-js-sdk';
        const scriptSrc = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        
        const existingScript = document.getElementById(scriptId) as HTMLScriptElement;

        // Clean container
        if (paypalContainerRef.current) paypalContainerRef.current.innerHTML = '';

        const renderButtons = () => {
            if ((window as any).paypal && paypalContainerRef.current) {
                // Double check container empty to avoid duplicates if called rapidly
                paypalContainerRef.current.innerHTML = '';
                
                try {
                    (window as any).paypal.Buttons({
                        createOrder: (data: any, actions: any) => {
                            return actions.order.create({
                                purchase_units: [{
                                    description: `${title} - ${description}`,
                                    amount: {
                                        value: amountUSD
                                    }
                                }]
                            });
                        },
                        onApprove: async (data: any, actions: any) => {
                            try {
                                const order = await actions.order.capture();
                                onSuccess('PayPal', order.id);
                                onClose();
                            } catch (err) {
                                console.error("Capture Error", err);
                                alert("Payment capture failed.");
                            }
                        },
                        onError: (err: any) => {
                            console.error("PayPal Error:", err);
                            // Don't alert on window closed
                        }
                    }).render(paypalContainerRef.current);
                } catch (e) {
                    console.error("Button render error", e);
                }
            }
        };

        if (existingScript && existingScript.src === scriptSrc) {
            // Script matches, use it
            if ((window as any).paypal) {
                renderButtons();
            } else {
                existingScript.onload = () => renderButtons();
            }
        } else {
            // Load or Reload script
            setIsSdkLoading(true);
            
            // Remove old script if exists
            if (existingScript) existingScript.remove();

            const script = document.createElement('script');
            script.id = scriptId;
            script.src = scriptSrc;
            script.async = true;
            script.onload = () => {
                setIsSdkLoading(false);
                renderButtons();
            };
            script.onerror = () => {
                setIsSdkLoading(false);
                console.error("Failed to load PayPal SDK");
            };
            document.body.appendChild(script);
        }
    }
  }, [isOpen, selectedGateway, paypalClientId, amountUSD, title, description]);

  const handleFlutterwavePayment = () => {
    if (!(window as any).FlutterwaveCheckout) {
      alert("Payment gateway failed to load. Please check your connection.");
      return;
    }

    if (!flutterwavePublicKey) {
      alert("Payment Error: Flutterwave Public Key is missing in admin settings.");
      return;
    }

    const config = {
      public_key: flutterwavePublicKey,
      tx_ref: Date.now().toString(),
      amount: amountTZS,
      currency: "TZS",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: email,
        name: name,
      },
      customizations: {
        title: title,
        description: description,
        logo: "https://st2.depositphotos.com/4035913/6124/i/450/depositphotos_61243733-stock-photo-business-alliance-icon.jpg", // Placeholder logo
      },
      callback: (data: any) => {
        if (data.status === "successful") {
           onSuccess('Flutterwave', data.transaction_id.toString());
           onClose();
        }
      },
      onclose: () => {
        // Handle modal closed
      },
    };

    (window as any).FlutterwaveCheckout(config);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
          <div>
             <h3 className="font-bold text-lg text-gray-900">Secure Payment</h3>
             <p className="text-sm text-gray-500">{title}</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
           
           {/* Amount Display */}
           <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Amount</p>
              <div className="text-3xl font-bold text-gray-900">
                {amountTZS.toLocaleString()} <span className="text-base font-medium text-gray-400">TZS</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">approx. ${amountUSD} USD</p>
           </div>

           {/* Gateway Selection */}
           <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Select Payment Method</p>
              
              {/* Flutterwave Option */}
              <button 
                onClick={() => { setSelectedGateway('flutterwave'); handleFlutterwavePayment(); }}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition group ${selectedGateway === 'flutterwave' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-[#FB9129]/10 flex items-center justify-center text-[#FB9129]">
                        <CreditCard size={20} />
                     </div>
                     <div className="text-left">
                        <div className="font-bold text-gray-900">Flutterwave</div>
                        <div className="text-xs text-gray-500">Mobile Money, Card (TZS)</div>
                     </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-gray-400"></div>
              </button>

              {/* PayPal Option */}
              <button 
                onClick={() => setSelectedGateway('paypal')}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition group ${selectedGateway === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-[#003087]/10 flex items-center justify-center text-[#003087]">
                        <Globe size={20} />
                     </div>
                     <div className="text-left">
                        <div className="font-bold text-gray-900">PayPal</div>
                        <div className="text-xs text-gray-500">International Cards (USD)</div>
                     </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedGateway === 'paypal' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                      {selectedGateway === 'paypal' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
              </button>

              {/* PayPal Buttons Container */}
              <div 
                className={`overflow-hidden transition-all duration-300 ${selectedGateway === 'paypal' ? 'max-h-96 mt-4' : 'max-h-0'}`}
              >
                  {isSdkLoading && (
                    <div className="flex items-center justify-center py-4 text-gray-500 gap-2">
                        <Loader2 className="animate-spin" size={20} /> Loading PayPal...
                    </div>
                  )}
                  <div ref={paypalContainerRef} className="w-full relative z-10"></div>
              </div>

              {/* Placeholder for future gateway */}
              <div className="pt-2">
                 <div className="flex items-center gap-2 justify-center text-xs text-gray-400">
                    <Wallet size={12} /> More payment options coming soon
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
           Secured by 256-bit SSL encryption
        </div>

      </div>
    </div>
  );
};