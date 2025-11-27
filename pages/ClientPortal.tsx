import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, FileText, Headphones, CreditCard, User as UserIcon, LogOut, MessageSquare, Plus, Trash2, Package, Check, Edit2, X, Download, Paperclip, Send, Settings, Save, Palette, Share2, Globe, Radio, Zap, LayoutTemplate, MessageCircle, Briefcase, Image as ImageIcon, Moon } from 'lucide-react';
import { useAuth, Service, User, Invoice, Ticket, Testimonial, PortfolioItem } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { jsPDF } from "jspdf";
import { PaymentModal } from '../components/PaymentModal';

// Icon Map for rendering
const iconMap: any = {
  Palette: <Palette size={24} />,
  Share2: <Share2 size={24} />,
  Globe: <Globe size={24} />,
  Radio: <Radio size={24} />,
  Zap: <Zap size={24} />,
  '🆕': <span className="text-xl">🆕</span>
};

interface ServiceCardProps {
  service: Service;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onEdit: (service: Service) => void;
  onBuy: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isAdmin, onDelete, onEdit, onBuy }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition relative text-gray-900 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900">
                {iconMap[service.icon] || <span className="text-lg">{service.icon}</span>}
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">{service.tag}</span>
        </div>
        <h4 className="font-bold mb-1 text-gray-900">{service.title}</h4>
        <p className="text-xs text-gray-500 mb-4 flex-grow">{service.description}</p>
        <div className="font-bold text-lg mb-4 text-gray-900">{service.price}</div>
        
        {isAdmin ? (
            <div className="mt-auto flex gap-2">
                <button 
                    onClick={() => onEdit(service)}
                    className="flex-1 bg-gray-100 text-gray-900 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-200 font-medium">
                    <Edit2 size={14} /> Edit
                </button>
                <button 
                    onClick={() => onDelete(service.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-red-100 font-medium">
                    <Trash2 size={14} /> Delete
                </button>
            </div>
        ) : (
            <button 
                onClick={() => onBuy(service)}
                className="w-full bg-[#111111] text-white py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-800 font-medium mt-auto">
                <ShoppingCart size={14} /> Buy Now
            </button>
        )}
    </div>
);

const ClientPortal: React.FC = () => {
  const { 
    user, logout, 
    services, addService, updateService, deleteService, 
    orders, placeOrder,
    users, addUser, updateUser, deleteUser,
    invoices, createInvoice, payInvoice,
    tickets, createTicket, replyToTicket, closeTicket,
    settings, updateSettings,
    homepageContent, updateHomepageContent,
    servicesContent, updateServicesContent,
    clientsContent, updateClientsContent,
    aboutContent, updateAboutContent,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    portfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem
  } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  
  // Support State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  
  // Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentItem, setPaymentItem] = useState<{ type: 'service' | 'invoice', data: Service | Invoice } | null>(null);

  const navigate = useNavigate();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user.role === 'admin';

  // --- Payment Handlers ---
  const parseAmount = (priceString: string): number => {
    const cleanString = priceString.replace(/[^0-9]/g, '');
    return parseInt(cleanString) || 0;
  };

  const initServicePayment = (service: Service) => {
    setPaymentItem({ type: 'service', data: service });
    setIsPaymentModalOpen(true);
  };

  const initInvoicePayment = (invoice: Invoice) => {
    setPaymentItem({ type: 'invoice', data: invoice });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (gateway: string, transactionId: string) => {
    if (!paymentItem) return;

    if (paymentItem.type === 'service') {
        const service = paymentItem.data as Service;
        // Immediate active status upon payment
        placeOrder(service, 'Active');
        alert(`Payment successful via ${gateway}! Order #${transactionId.slice(-6)} created and activated.`);
    } else if (paymentItem.type === 'invoice') {
        const invoice = paymentItem.data as Invoice;
        payInvoice(invoice.id);
        alert(`Payment successful via ${gateway}! Invoice #${invoice.id.slice(-4)} marked as paid.`);
    }
    
    setPaymentItem(null);
  };


  // --- PDF Generation ---
  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header Background
    doc.setFillColor(249, 250, 251); // Gray 50
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo / Brand (Using Dynamic Settings)
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    
    // Simple split for name if needed, or just display full name
    const companyNameParts = settings.companyName.split(' ');
    doc.text(companyNameParts[0], 20, 25);
    doc.setFont("helvetica", "normal");
    if(companyNameParts.length > 1) {
        doc.text(companyNameParts.slice(1).join(' '), 20 + (doc.getTextWidth(companyNameParts[0]) + 2), 25);
    }

    // Company Details (Dynamic)
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(settings.companyEmail, 20, 32);
    doc.text(settings.companyAddress, 20, 36);

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.text("INVOICE", pageWidth - 20, 25, { align: 'right' });

    // Invoice Meta
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(`#${invoice.id.slice(-6).toUpperCase()}`, pageWidth - 20, 32, { align: 'right' });
    
    // Content Container
    let y = 60;

    // Bill To
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175); // Gray 400
    doc.text("BILLED TO", 20, y);
    
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.userName, 20, y + 6);
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text("Client Account", 20, y + 11);

    // Invoice Info
    doc.setTextColor(156, 163, 175);
    doc.text("DATE ISSUED", 120, y);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.date, 120, y + 6);

    doc.setTextColor(156, 163, 175);
    doc.text("DUE DATE", 160, y);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.dueDate, 160, y + 6);

    y += 30;

    // Table Header
    doc.setFillColor(243, 244, 246); // Gray 100
    doc.rect(20, y - 5, pageWidth - 40, 10, 'F');
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);
    doc.text("ITEM DESCRIPTION", 25, y + 1);
    doc.text("AMOUNT", pageWidth - 25, y + 1, { align: 'right' });

    y += 15;

    // Table Row
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.title, 25, y);
    doc.text(invoice.amount, pageWidth - 25, y, { align: 'right' });

    // Line
    doc.setDrawColor(229, 231, 235);
    doc.line(20, y + 5, pageWidth - 20, y + 5);

    y += 20;

    // Totals
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Subtotal", 140, y);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.amount, pageWidth - 25, y, { align: 'right' });

    y += 8;
    doc.setTextColor(107, 114, 128);
    doc.text("Tax (0%)", 140, y);
    doc.setTextColor(17, 24, 39);
    doc.text("0 TZS", pageWidth - 25, y, { align: 'right' });

    y += 10;
    // Total Line
    doc.line(130, y - 4, pageWidth - 20, y - 4);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total", 140, y + 2);
    doc.text(invoice.amount, pageWidth - 25, y + 2, { align: 'right' });

    // Status Badge equivalent
    y += 30;
    const statusColor = invoice.status === 'Paid' ? [34, 197, 94] : [239, 68, 68];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFontSize(14);
    doc.text(invoice.status.toUpperCase(), 20, y);

    // Footer (Dynamic)
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(`${settings.companyName} | ${settings.companyEmail} | ${settings.companyAddress}`, pageWidth / 2, footerY, { align: 'center' });

    doc.save(`invoice-${invoice.id}.pdf`);
  };

  // --- Components for different views ---

  const ServiceUpsertForm = () => {
    const [title, setTitle] = useState(editingService?.title || '');
    const [price, setPrice] = useState(editingService?.price || '');
    const [tag, setTag] = useState(editingService?.tag || '');
    const [description, setDescription] = useState(editingService?.description || '');
    const [icon, setIcon] = useState(editingService?.icon || 'Palette');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            updateService(editingService.id, { title, price, tag, icon, description });
        } else {
            addService({ title, price, tag, icon, description });
        }
        setIsAddingService(false);
        setEditingService(null);
    };

    const handleCancel = () => {
        setIsAddingService(false);
        setEditingService(null);
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 text-gray-900">
            <h3 className="font-bold mb-4 text-gray-900">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                    <input type="text" placeholder="Service Title" className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-black focus:outline-none" value={title} onChange={e => setTitle(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input type="text" placeholder="Price (e.g., 500,000 TZS)" className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-black focus:outline-none" value={price} onChange={e => setPrice(e.target.value)} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                    <input type="text" placeholder="Tag (e.g., Design)" className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-black focus:outline-none" value={tag} onChange={e => setTag(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" value={icon} onChange={e => setIcon(e.target.value)}>
                      <option value="Palette">Palette (Design)</option>
                      <option value="Share2">Share (Social)</option>
                      <option value="Globe">Globe (Web)</option>
                      <option value="Zap">Zap (Ads)</option>
                      <option value="Radio">Radio (Media)</option>
                      <option value="🆕">New (Default)</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                   <textarea placeholder="Describe the service..." className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-black focus:outline-none h-20" value={description} onChange={e => setDescription(e.target.value)} required />
                </div>

                <div className="flex gap-2 pt-2">
                    <Button type="submit">{editingService ? 'Update Service' : 'Save Service'}</Button>
                    <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
                </div>
            </form>
        </div>
    );
  };

  const OrdersList = () => {
    const displayedOrders = isAdmin ? orders : orders.filter(o => o.userId === user.id);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-gray-900">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900">Order History</h3>
            </div>
            {displayedOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No orders found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Service</th>
                                {isAdmin && <th className="px-6 py-4">User ID</th>}
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayedOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-gray-400">#{order.id.slice(-6)}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.serviceTitle}</td>
                                    {isAdmin && <td className="px-6 py-4 text-xs text-gray-500">{order.userId}</td>}
                                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{order.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
  };

  const UserManagement = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'admin'|'client'>('client');

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({ name, email, password, role });
        setIsAddingUser(false);
        setName(''); setEmail(''); setPassword('');
    };

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Manage Users</h3>
                <Button onClick={() => setIsAddingUser(!isAddingUser)} className="flex items-center gap-2">
                    {isAddingUser ? <X size={16}/> : <Plus size={16}/>}
                    {isAddingUser ? "Cancel" : "Add User"}
                </Button>
             </div>

             {isAddingUser && (
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <h4 className="font-bold mb-4">Create New User</h4>
                     <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input type="text" placeholder="Full Name" className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" value={name} onChange={e=>setName(e.target.value)} required/>
                         <input type="email" placeholder="Email" className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" value={email} onChange={e=>setEmail(e.target.value)} required/>
                         <input type="password" placeholder="Password" className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" value={password} onChange={e=>setPassword(e.target.value)} required/>
                         <select className="p-2 border border-gray-300 rounded bg-white text-gray-900" value={role} onChange={e=>setRole(e.target.value as any)}>
                             <option value="client">Client</option>
                             <option value="admin">Admin</option>
                         </select>
                         <div className="md:col-span-2">
                             <Button type="submit" className="w-full">Create User</Button>
                         </div>
                     </form>
                 </div>
             )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                                <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {u.id !== 'admin' && ( // Prevent deleting main admin
                                        <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700"
                                            onMouseDown={() => { if(confirm('Delete user?')) deleteUser(u.id); }}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  const InvoiceManagement = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');

    const displayedInvoices = isAdmin ? invoices : invoices.filter(i => i.userId === user.id);

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedUserId) return alert("Select a user");
        
        createInvoice({
            title,
            amount,
            dueDate,
            date: new Date().toLocaleDateString(),
            userId: selectedUserId
        });
        setIsCreatingInvoice(false);
        setTitle(''); setAmount(''); setDueDate(''); setSelectedUserId('');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Invoices</h3>
                {isAdmin && (
                    <Button onClick={() => setIsCreatingInvoice(!isCreatingInvoice)} className="flex items-center gap-2">
                        {isCreatingInvoice ? <X size={16}/> : <Plus size={16}/>}
                        {isCreatingInvoice ? "Cancel" : "Create Invoice"}
                    </Button>
                )}
            </div>

            {isAdmin && isCreatingInvoice && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold mb-4">Create New Invoice</h4>
                    <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Select User</label>
                            <select className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} required>
                                <option value="">-- Choose Client --</option>
                                {users.filter(u => u.role === 'client').map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                        </div>
                        <input type="text" placeholder="Description / Title" className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" value={title} onChange={e=>setTitle(e.target.value)} required/>
                        <input type="text" placeholder="Amount (e.g. 500,000 TZS)" className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" value={amount} onChange={e=>setAmount(e.target.value)} required/>
                        <input type="date" className="p-2 border border-gray-300 rounded bg-white text-gray-900" value={dueDate} onChange={e=>setDueDate(e.target.value)} required/>
                        <div className="md:col-span-2">
                            <Button type="submit" className="w-full">Issue Invoice</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {displayedInvoices.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No invoices found.</div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-6 py-4">Title</th>
                                {isAdmin && <th className="px-6 py-4">Client</th>}
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayedInvoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-gray-400">#{inv.id.slice(-4)}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{inv.title}</td>
                                    {isAdmin && <td className="px-6 py-4 text-xs text-gray-500">{inv.userName}</td>}
                                    <td className="px-6 py-4 text-gray-500">{inv.dueDate}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{inv.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button 
                                            onClick={() => generatePDF(inv)}
                                            className="text-gray-400 hover:text-black transition"
                                            title="Download PDF"
                                        >
                                            <Download size={18} />
                                        </button>

                                        {!isAdmin && inv.status === 'Pending' && (
                                            <button 
                                                onClick={() => initInvoicePayment(inv)}
                                                className="bg-black text-white px-3 py-1 rounded text-xs font-bold hover:bg-gray-800">
                                                Pay Now
                                            </button>
                                        )}
                                        {isAdmin && inv.status === 'Pending' && (
                                            <span className="text-xs text-gray-400 italic">Unpaid</span>
                                        )}
                                        {inv.status === 'Paid' && (
                                            <div className="text-green-600 flex items-center gap-1 text-xs font-bold">
                                                <Check size={14} /> Paid
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
  };

  const SupportSystem = () => {
    const [newSubject, setNewSubject] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    // Filter tickets based on role
    const displayTickets = isAdmin ? tickets : tickets.filter(t => t.userId === user.id);
    const selectedTicket = tickets.find(t => t.id === selectedTicketId);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        await createTicket({
            subject: newSubject,
            message: newMessage,
            serviceId: serviceId || 'others',
            attachment: attachment || undefined
        });
        setIsCreatingTicket(false);
        setNewSubject(''); setNewMessage(''); setServiceId(''); setAttachment(null);
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicketId) return;
        await replyToTicket(selectedTicketId, newMessage, attachment || undefined);
        setNewMessage(''); setAttachment(null);
    };

    if (selectedTicket) {
        return (
            <div className="h-[600px] flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <button onClick={() => setSelectedTicketId(null)} className="text-sm text-gray-500 hover:text-black mb-1">← Back to tickets</button>
                        <h3 className="font-bold text-lg text-gray-900">{selectedTicket.subject}</h3>
                        <div className="flex gap-2 text-xs text-gray-500">
                            <span>{selectedTicket.serviceName}</span>
                            <span>•</span>
                            <span>ID: #{selectedTicket.id.slice(-4)}</span>
                            {isAdmin && <span>• By {selectedTicket.userName}</span>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            selectedTicket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                            selectedTicket.status === 'Answered' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>{selectedTicket.status}</span>
                        {isAdmin && selectedTicket.status !== 'Closed' && (
                            <Button variant="outline" size="sm" onClick={() => closeTicket(selectedTicket.id)}>Close Ticket</Button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {selectedTicket.messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.senderId === user.id ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                            <div className={`p-4 rounded-lg shadow-sm ${msg.senderId === user.id ? 'bg-black text-white rounded-br-none' : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                {msg.attachment && (
                                    <div className="mt-2">
                                        <img src={msg.attachment} alt="Attachment" className="max-w-xs rounded-md border border-white/20" />
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-400 mt-1">
                                {msg.senderId === user.id ? 'You' : msg.senderName} • {msg.timestamp}
                            </span>
                        </div>
                    ))}
                </div>

                {selectedTicket.status !== 'Closed' && (
                    <form onSubmit={handleReply} className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <input 
                                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 text-sm focus:outline-none focus:border-black placeholder:text-gray-400" 
                                    placeholder="Type your reply..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    required
                                />
                                {attachment && (
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <Paperclip size={10} /> Attached: {attachment.name}
                                        <button type="button" onClick={() => setAttachment(null)} className="text-red-500 ml-1">x</button>
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded">
                                <Paperclip size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={e => setAttachment(e.target.files?.[0] || null)} />
                            </label>
                            <Button type="submit" size="sm" className="h-auto">
                                <Send size={18} />
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Support Tickets</h3>
                {!isAdmin && (
                    <Button onClick={() => setIsCreatingTicket(!isCreatingTicket)} className="flex items-center gap-2">
                        {isCreatingTicket ? <X size={16}/> : <Plus size={16}/>}
                        {isCreatingTicket ? "Cancel" : "New Ticket"}
                    </Button>
                )}
            </div>

            {isCreatingTicket && !isAdmin && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold mb-4">Submit a Request</h4>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Related Service</label>
                            <select className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" value={serviceId} onChange={e => setServiceId(e.target.value)} required>
                                <option value="">Select a service...</option>
                                <option value="others">Others / General Inquiry</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" value={newSubject} onChange={e => setNewSubject(e.target.value)} required placeholder="Brief summary of the issue"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 h-32 placeholder:text-gray-400" value={newMessage} onChange={e => setNewMessage(e.target.value)} required placeholder="Describe your issue in detail..."/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Attachment (Image)</label>
                            <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" onChange={e => setAttachment(e.target.files?.[0] || null)} />
                        </div>
                        <Button type="submit" className="w-full">Submit Ticket</Button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {displayTickets.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No support tickets found.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {displayTickets.map(ticket => (
                            <div key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition">
                                <div>
                                    <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                                    <p className="text-sm text-gray-500">
                                        {ticket.serviceName} • Last update: {ticket.lastUpdated}
                                    </p>
                                    {isAdmin && <p className="text-xs text-gray-400 mt-1">Client: {ticket.userName}</p>}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                    ticket.status === 'Answered' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {ticket.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
  };

  const TestimonialsManager = () => {
      const [quote, setQuote] = useState('');
      const [name, setName] = useState('');
      const [role, setRole] = useState('');
      const [company, setCompany] = useState('');
      const [tag, setTag] = useState('');
      const [avatarFile, setAvatarFile] = useState<File | null>(null);
      const [isAdding, setIsAdding] = useState(false);
      const [editingId, setEditingId] = useState<string | null>(null);

      // Helper for base64
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      const handleSave = async (e: React.FormEvent) => {
          e.preventDefault();
          
          let avatarBase64 = undefined;
          if (avatarFile) {
              try {
                  avatarBase64 = await fileToBase64(avatarFile);
              } catch(e) {
                  console.error("Error processing image", e);
              }
          }

          if (editingId) {
             updateTestimonial(editingId, { 
                quote, name, role, company, tag, 
                ...(avatarBase64 ? { avatar: avatarBase64 } : {}) 
             });
          } else {
             addTestimonial({ quote, name, role, company, tag, avatar: avatarBase64 });
          }
          
          resetForm();
      };

      const handleEdit = (t: Testimonial) => {
        setQuote(t.quote);
        setName(t.name);
        setRole(t.role);
        setCompany(t.company);
        setTag(t.tag);
        setEditingId(t.id);
        setIsAdding(true);
      };

      const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setQuote(''); setName(''); setRole(''); setCompany(''); setTag(''); setAvatarFile(null);
      };

      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Manage Testimonials</h3>
                  <Button onClick={() => { if(isAdding) resetForm(); else setIsAdding(true); }} className="flex items-center gap-2">
                      {isAdding ? <X size={16}/> : <Plus size={16}/>}
                      {isAdding ? "Cancel" : "Add Testimonial"}
                  </Button>
              </div>

              {isAdding && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="font-bold mb-4">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h4>
                      <form onSubmit={handleSave} className="space-y-4">
                          <textarea className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" placeholder="Quote" value={quote} onChange={e => setQuote(e.target.value)} required />
                          <div className="grid grid-cols-2 gap-4">
                              <input className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                              <input className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" placeholder="Role" value={role} onChange={e => setRole(e.target.value)} required />
                              <input className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} required />
                              <input className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" placeholder="Tag (e.g. Technology)" value={tag} onChange={e => setTag(e.target.value)} required />
                          </div>
                           <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client Avatar (Optional)</label>
                                <div className="flex items-center gap-2">
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <ImageIcon size={16} />
                                        {avatarFile ? avatarFile.name : "Upload New Image"}
                                        <input type="file" className="hidden" accept="image/*" onChange={e => setAvatarFile(e.target.files?.[0] || null)} />
                                    </label>
                                    {avatarFile && <button type="button" onClick={() => setAvatarFile(null)} className="text-red-500 text-sm">Remove</button>}
                                </div>
                            </div>
                          <Button type="submit">{editingId ? 'Update' : 'Save'}</Button>
                      </form>
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map(t => (
                      <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => handleEdit(t)} className="text-blue-500 hover:bg-blue-50 p-1 rounded">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteTestimonial(t.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex gap-4 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {t.avatar ? (
                                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                  ) : (
                                      <span className="font-bold text-gray-400">{t.name.split(' ').map(n=>n[0]).join('')}</span>
                                  )}
                              </div>
                              <div>
                                  <div className="font-bold text-sm">{t.name}</div>
                                  <div className="text-xs text-gray-500">{t.role}, {t.company}</div>
                              </div>
                          </div>
                          <p className="text-sm italic mb-2">"{t.quote}"</p>
                          <div className="mt-2 text-xs font-bold bg-gray-100 inline-block px-2 py-1 rounded text-gray-600">{t.tag}</div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  const PortfolioManager = () => {
      const [title, setTitle] = useState('');
      const [desc, setDesc] = useState('');
      const [category, setCategory] = useState<'Technology'|'Design'|'Media'>('Technology');
      const [tags, setTags] = useState('');
      const [imageUrl, setImageUrl] = useState('');
      const [isAdding, setIsAdding] = useState(false);
      const [editingId, setEditingId] = useState<string | null>(null);

      const handleSave = (e: React.FormEvent) => {
          e.preventDefault();
          const tagsArray = tags.split(',').map(t => t.trim());
          
          if (editingId) {
             updatePortfolioItem(editingId, {
                title, description: desc, category, tags: tagsArray, imageUrl
             });
          } else {
             addPortfolioItem({
                title, description: desc, category, tags: tagsArray, imageUrl
             });
          }
          resetForm();
      };

      const handleEdit = (p: PortfolioItem) => {
          setTitle(p.title);
          setDesc(p.description);
          setCategory(p.category);
          setTags(p.tags.join(', '));
          setImageUrl(p.imageUrl);
          setEditingId(p.id);
          setIsAdding(true);
      };

      const resetForm = () => {
          setIsAdding(false);
          setEditingId(null);
          setTitle(''); setDesc(''); setTags(''); setImageUrl('');
      };

      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Manage Portfolio</h3>
                  <Button onClick={() => { if(isAdding) resetForm(); else setIsAdding(true); }} className="flex items-center gap-2">
                      {isAdding ? <X size={16}/> : <Plus size={16}/>}
                      {isAdding ? "Cancel" : "Add Project"}
                  </Button>
              </div>

              {isAdding && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="font-bold mb-4">{editingId ? 'Edit Project' : 'Add Project'}</h4>
                      <form onSubmit={handleSave} className="space-y-4">
                          <input className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
                          <textarea className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required />
                          <div className="grid grid-cols-2 gap-4">
                              <select className="p-2 border border-gray-300 rounded bg-white text-gray-900" value={category} onChange={e => setCategory(e.target.value as any)}>
                                  <option value="Technology">Technology</option>
                                  <option value="Design">Design</option>
                                  <option value="Media">Media</option>
                              </select>
                              <input className="p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} required />
                          </div>
                          <input className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
                          <Button type="submit">{editingId ? 'Update Project' : 'Save Project'}</Button>
                      </form>
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioItems.map(p => (
                      <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative group">
                          <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => handleEdit(p)} className="bg-white/90 text-blue-500 hover:bg-blue-50 p-1 rounded shadow-sm">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => deletePortfolioItem(p.id)} className="bg-white/90 text-red-500 hover:bg-red-50 p-1 rounded shadow-sm">
                                <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="h-32 bg-gray-100">
                              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                              <div className="text-xs font-bold text-blue-600 mb-1">{p.category}</div>
                              <h4 className="font-bold text-sm mb-1">{p.title}</h4>
                              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{p.description}</p>
                              <div className="flex flex-wrap gap-1">
                                  {p.tags.map(t => (
                                      <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">{t}</span>
                                  ))}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  const SettingsView = () => {
    const [formData, setFormData] = useState(settings);
    const [msg, setMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({...formData, [e.target.name]: val});
    };

    const handleSave = () => {
        updateSettings(formData);
        setMsg('Settings saved successfully!');
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900">System Settings</h3>
            
            {msg && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{msg}</div>}

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <Palette size={18}/> Appearance
                </h4>
                <div className="space-y-4">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Website Theme</label>
                         <select name="theme" value={formData.theme || 'default'} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900">
                             <option value="default">Classic</option>
                             <option value="modern-dark">Modern Dark (Wen Launch)</option>
                         </select>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <input 
                            type="checkbox" 
                            id="darkMode"
                            name="darkMode" 
                            checked={formData.darkMode} 
                            onChange={handleChange}
                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="darkMode" className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
                            <Moon size={16} /> Enable Dark Mode Globally
                        </label>
                    </div>
                    <p className="text-xs text-gray-500">
                        Checking this ensures all pages use the dark color scheme, even if the Classic theme is selected. 
                        The Modern Dark theme enables this by default.
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <UserIcon size={18}/> Company Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input name="companyEmail" value={formData.companyEmail} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input name="companyPhone" value={formData.companyPhone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input name="companyAddress" value={formData.companyAddress} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                </div>
            </div>

            {/* Social Media Settings */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <Share2 size={18}/> Social Media Links
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                        <input name="companyFacebook" value={formData.companyFacebook || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="https://facebook.com/..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                        <input name="companyInstagram" value={formData.companyInstagram || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                        <input name="companyLinkedin" value={formData.companyLinkedin || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="https://linkedin.com/in/..." />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <CreditCard size={18}/> Payment Gateways
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Flutterwave Public Key</label>
                        <input name="flutterwavePublicKey" value={formData.flutterwavePublicKey} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 font-mono text-sm"/>
                        <p className="text-xs text-gray-500 mt-1">Used for card and mobile money payments.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Client ID</label>
                        <input name="paypalClientId" value={formData.paypalClientId} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 font-mono text-sm"/>
                        <p className="text-xs text-gray-500 mt-1">Used for PayPal buttons (Sandbox/Live).</p>
                    </div>
                </div>
            </div>

            <Button onClick={handleSave} className="flex items-center gap-2">
                <Save size={16}/> Save Settings
            </Button>
        </div>
    );
  };

  const CMSView = () => {
    const { 
        homepageContent, updateHomepageContent, 
        servicesContent, updateServicesContent,
        clientsContent, updateClientsContent,
        aboutContent, updateAboutContent
    } = useAuth();
    
    const [homeData, setHomeData] = useState(homepageContent);
    const [servicesData, setServicesData] = useState(servicesContent);
    const [clientsData, setClientsData] = useState(clientsContent);
    const [aboutData, setAboutData] = useState(aboutContent);

    const [msg, setMsg] = useState('');

    const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setHomeData({ ...homeData, [e.target.name]: e.target.value });
    };

    const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setServicesData({ ...servicesData, [e.target.name]: e.target.value });
    };

    const handleClientsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setClientsData({ ...clientsData, [e.target.name]: e.target.value });
    };

    const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAboutData({ ...aboutData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateHomepageContent(homeData);
        updateServicesContent(servicesData);
        updateClientsContent(clientsData);
        updateAboutContent(aboutData);
        setMsg('Content saved successfully!');
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">CMS - Website Content</h3>
             </div>

             {msg && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{msg}</div>}

             {/* Homepage Section */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold mb-6 text-gray-900 border-b pb-2">Homepage Content</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                        <input name="heroTitle" value={homeData.heroTitle} onChange={handleHomeChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                        <textarea name="heroSubtitle" value={homeData.heroSubtitle} onChange={handleHomeChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 h-24"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Services Title</label>
                        <input name="servicesTitle" value={homeData.servicesTitle} onChange={handleHomeChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
                        <input name="ctaTitle" value={homeData.ctaTitle} onChange={handleHomeChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                </div>
             </div>

             {/* Services Page Section */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold mb-6 text-gray-900 border-b pb-2">Services Page Content</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                        <input name="heroTitle" value={servicesData.heroTitle} onChange={handleServicesChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description</label>
                        <textarea name="heroDescription" value={servicesData.heroDescription} onChange={handleServicesChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 h-24"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Solutions Title</label>
                        <input name="customSolutionsTitle" value={servicesData.customSolutionsTitle} onChange={handleServicesChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Solutions Description</label>
                        <textarea name="customSolutionsDescription" value={servicesData.customSolutionsDescription} onChange={handleServicesChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 h-20"/>
                    </div>
                </div>
             </div>

             {/* Clients Page Section */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold mb-6 text-gray-900 border-b pb-2">Clients Page Content</h4>
                
                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Hero Section</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                        <textarea name="heroTitle" value={clientsData.heroTitle} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 h-20"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                        <input name="heroImage" value={clientsData.heroImage} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Tags (Comma separated)</label>
                        <input name="heroTags" value={clientsData.heroTags} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Top Stats Strip</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div><input name="stat1Title" placeholder="Stat 1 Title" value={clientsData.stat1Title} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><input name="stat1Subtitle" placeholder="Stat 1 Subtitle" value={clientsData.stat1Subtitle} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><input name="stat2Title" placeholder="Stat 2 Title" value={clientsData.stat2Title} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><input name="stat2Subtitle" placeholder="Stat 2 Subtitle" value={clientsData.stat2Subtitle} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><input name="stat3Title" placeholder="Stat 3 Title" value={clientsData.stat3Title} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><input name="stat3Subtitle" placeholder="Stat 3 Subtitle" value={clientsData.stat3Subtitle} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><input name="stat4Title" placeholder="Stat 4 Title" value={clientsData.stat4Title} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><input name="stat4Subtitle" placeholder="Stat 4 Subtitle" value={clientsData.stat4Subtitle} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Featured Project 1 (Safari)</h5>
                <div className="space-y-4 mb-6">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                         <input name="project1Title" value={clientsData.project1Title} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                         <textarea name="project1Description" value={clientsData.project1Description} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 h-24"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input name="project1Image" value={clientsData.project1Image} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                            <input name="project1Link" value={clientsData.project1Link} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                        </div>
                    </div>
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Middle Stats Bar</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                     <div className="space-y-2"><input name="midStat1Value" value={clientsData.midStat1Value} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/><input name="midStat1Label" value={clientsData.midStat1Label} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 text-xs"/></div>
                     <div className="space-y-2"><input name="midStat2Value" value={clientsData.midStat2Value} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/><input name="midStat2Label" value={clientsData.midStat2Label} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 text-xs"/></div>
                     <div className="space-y-2"><input name="midStat3Value" value={clientsData.midStat3Value} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/><input name="midStat3Label" value={clientsData.midStat3Label} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 text-xs"/></div>
                     <div className="space-y-2"><input name="midStat4Value" value={clientsData.midStat4Value} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/><input name="midStat4Label" value={clientsData.midStat4Label} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 text-xs"/></div>
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Featured Project 2 (Workplackers)</h5>
                <div className="space-y-4">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                         <input name="project2Title" value={clientsData.project2Title} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                         <textarea name="project2Description" value={clientsData.project2Description} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 h-24"/>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Bullet Points (Newline separated)</label>
                         <textarea name="project2Bullets" value={clientsData.project2Bullets} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 h-24"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input name="project2Image" value={clientsData.project2Image} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                            <input name="project2Link" value={clientsData.project2Link} onChange={handleClientsChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                        </div>
                    </div>
                </div>

             </div>

             {/* About Page Section */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold mb-6 text-gray-900 border-b pb-2">About Page Content</h4>
                
                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Hero Section</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div><label className="block text-xs mb-1">Line 1</label><input name="heroTitleLine1" value={aboutData.heroTitleLine1} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><label className="block text-xs mb-1">Line 2</label><input name="heroTitleLine2" value={aboutData.heroTitleLine2} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><label className="block text-xs mb-1">Line 3</label><input name="heroTitleLine3" value={aboutData.heroTitleLine3} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><label className="block text-xs mb-1">Line 4</label><input name="heroTitleLine4" value={aboutData.heroTitleLine4} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><label className="block text-xs mb-1">Line 5 (Prefix)</label><input name="heroTitleLine5" value={aboutData.heroTitleLine5} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><label className="block text-xs mb-1">Line 5 (Highlighted Location)</label><input name="heroTitleLocation" value={aboutData.heroTitleLocation} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                        <input name="heroImage" value={aboutData.heroImage} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                    </div>
                </div>

                <div className="mb-6">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Marquee Tags (Comma separated)</label>
                     <input name="marqueeTags" value={aboutData.marqueeTags} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Introduction</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div><label className="block text-xs mb-1">Label</label><input name="introLabel" value={aboutData.introLabel} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><label className="block text-xs mb-1">Title</label><input name="introTitle" value={aboutData.introTitle} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div className="md:col-span-2">
                        <label className="block text-xs mb-1">Description</label>
                        <textarea name="introDescription" value={aboutData.introDescription} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 h-20"/>
                    </div>
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Intro Stats (3 Columns)</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                     <div><label className="block text-xs mb-1">Stat 1 Label</label><input name="introStat1Label" value={aboutData.introStat1Label} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                     <div><label className="block text-xs mb-1">Stat 1 Value</label><input name="introStat1Value" value={aboutData.introStat1Value} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                     
                     <div><label className="block text-xs mb-1">Stat 2 Label</label><input name="introStat2Label" value={aboutData.introStat2Label} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                     <div><label className="block text-xs mb-1">Stat 2 Value</label><input name="introStat2Value" value={aboutData.introStat2Value} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                     
                     <div><label className="block text-xs mb-1">Stat 3 Label</label><input name="introStat3Label" value={aboutData.introStat3Label} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                     <div><label className="block text-xs mb-1">Stat 3 Value</label><input name="introStat3Value" value={aboutData.introStat3Value} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Big Stats Grid</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                     <div><label className="block text-xs mb-1">Stat 1 Value</label><input name="bigStat1Value" value={aboutData.bigStat1Value} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                     <div><label className="block text-xs mb-1">Stat 1 Label</label><input name="bigStat1Label" value={aboutData.bigStat1Label} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>

                     <div><label className="block text-xs mb-1">Stat 2 Value</label><input name="bigStat2Value" value={aboutData.bigStat2Value} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                     <div><label className="block text-xs mb-1">Stat 2 Label</label><input name="bigStat2Label" value={aboutData.bigStat2Label} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                     
                     <div><label className="block text-xs mb-1">Stat 3 Value</label><input name="bigStat3Value" value={aboutData.bigStat3Value} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                     <div><label className="block text-xs mb-1">Stat 3 Label</label><input name="bigStat3Label" value={aboutData.bigStat3Label} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Services Section</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div><label className="block text-xs mb-1">Main Title</label><input name="servicesTitle" value={aboutData.servicesTitle} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><label className="block text-xs mb-1">Subtitle</label><input name="servicesSubtitle" value={aboutData.servicesSubtitle} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                </div>
                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input name="service1Title" value={aboutData.service1Title} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="Service 1 Title"/>
                        <input name="service1Desc" value={aboutData.service1Desc} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="Service 1 Description"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input name="service2Title" value={aboutData.service2Title} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="Service 2 Title"/>
                        <input name="service2Desc" value={aboutData.service2Desc} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="Service 2 Description"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input name="service3Title" value={aboutData.service3Title} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="Service 3 Title"/>
                        <input name="service3Desc" value={aboutData.service3Desc} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="Service 3 Description"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input name="service4Title" value={aboutData.service4Title} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="Service 4 Title"/>
                        <input name="service4Desc" value={aboutData.service4Desc} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="Service 4 Description"/>
                    </div>
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">Recognition / Awards</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div><label className="block text-xs mb-1">Main Title</label><input name="recognitionTitle" value={aboutData.recognitionTitle} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                    <div><label className="block text-xs mb-1">Subtitle</label><input name="recognitionSubtitle" value={aboutData.recognitionSubtitle} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/></div>
                </div>
                <div className="space-y-2 mb-6">
                    {[1,2,3,4].map(num => (
                        <div key={num} className="grid grid-cols-3 gap-2">
                            <input name={`award${num}Title`} value={(aboutData as any)[`award${num}Title`]} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900 text-xs" placeholder={`Award ${num} Title`}/>
                            <input name={`award${num}Category`} value={(aboutData as any)[`award${num}Category`]} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900 text-xs" placeholder={`Category`}/>
                            <input name={`award${num}Year`} value={(aboutData as any)[`award${num}Year`]} onChange={handleAboutChange} className="p-2 border border-gray-300 rounded bg-white text-gray-900 text-xs" placeholder={`Year`}/>
                        </div>
                    ))}
                </div>

                <h5 className="font-bold text-sm uppercase text-gray-500 mb-4">CTA Section</h5>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                     <input name="ctaTitle" value={aboutData.ctaTitle} onChange={handleAboutChange} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"/>
                </div>

             </div>

             <Button onClick={handleSave} className="flex items-center gap-2">
                <Save size={16}/> Save All Content
            </Button>
        </div>
    );
  };


  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => { setIsPaymentModalOpen(false); setPaymentItem(null); }}
        onSuccess={handlePaymentSuccess}
        amountTZS={paymentItem ? parseAmount(paymentItem.type === 'service' ? (paymentItem.data as Service).price : (paymentItem.data as Invoice).amount) : 0}
        email={user.email}
        name={user.name}
        title={paymentItem ? (paymentItem.type === 'service' ? 'Service Order' : 'Invoice Payment') : ''}
        description={paymentItem ? (paymentItem.type === 'service' ? (paymentItem.data as Service).title : `Invoice #${(paymentItem.data as Invoice).id}`) : ''}
        flutterwavePublicKey={settings.flutterwavePublicKey}
        paypalClientId={settings.paypalClientId}
      />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10 text-gray-900">
        <div className="p-6 border-b border-gray-100">
           <Link to="/" className="text-xl font-bold text-gray-900">RIC <span className="text-gray-400 font-normal">Portal</span></Link>
        </div>
        
        <div className="p-4 space-y-8 flex-grow overflow-y-auto">
           <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">General</div>
              <nav className="space-y-1">
                 <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <LayoutDashboard size={18} className="mr-3" />
                    Dashboard
                 </button>
                 <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <Package size={18} className="mr-3" />
                    Orders
                 </button>
                 <button onClick={() => setActiveTab('invoices')} className={`w-full flex items-center px-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'invoices' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <FileText size={18} className="mr-3" />
                    Invoices
                 </button>
              </nav>
           </div>

           <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Tools</div>
              <nav className="space-y-1">
                 <button onClick={() => setActiveTab('support')} className={`w-full flex items-center px-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'support' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <Headphones size={18} className="mr-3" />
                    Support
                 </button>
                 <button className="w-full flex items-center px-2 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm font-medium transition">
                    <CreditCard size={18} className="mr-3" />
                    Payments
                 </button>
              </nav>
           </div>
           
           {isAdmin && (
             <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Admin</div>
                <nav className="space-y-1">
                   <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'users' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                      <UserIcon size={18} className="mr-3" />
                      Manage Users
                   </button>
                   <button onClick={() => setActiveTab('cms')} className={`w-full flex items-center px-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'cms' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                      <LayoutTemplate size={18} className="mr-3" />
                      CMS - Pages
                   </button>
                   <button onClick={() => setActiveTab('testimonials')} className={`w-full flex items-center px-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'testimonials' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                      <MessageCircle size={18} className="mr-3" />
                      Testimonials
                   </button>
                    <button onClick={() => setActiveTab('portfolio')} className={`w-full flex items-center px-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'portfolio' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                      <Briefcase size={18} className="mr-3" />
                      Portfolio
                   </button>
                   <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'settings' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                      <Settings size={18} className="mr-3" />
                      Settings
                   </button>
                </nav>
             </div>
           )}
        </div>

        <div className="p-4 border-t border-gray-100">
           <button onClick={handleLogout} className="w-full flex items-center px-2 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition">
               <LogOut size={18} className="mr-3" />
               Log out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
         
         {/* Mobile Header */}
         <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-20">
            <span className="font-bold text-gray-900">RIC Portal</span>
            <div className="flex gap-4">
                <Link to="/" className="text-sm text-gray-500">Back to Site</Link>
                <button onClick={handleLogout} className="text-sm text-red-500">Logout</button>
            </div>
         </div>

         {/* Dashboard Content */}
         <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            
            {/* Header Area */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">
                    {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
                  </h1>
                  <div className="flex items-center space-x-3 mt-1">
                     <div className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0)}
                     </div>
                     <span className="text-sm font-medium text-gray-700">{user.name}</span>
                     {isAdmin && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">👑 Admin</span>}
                     {!isAdmin && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">Client</span>}
                  </div>
               </div>
            </header>

            {/* Content Switcher */}
            {activeTab === 'dashboard' && (
                <>
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg mb-10">
                    <h2 className="text-3xl font-bold mb-2 text-white">Welcome back, {user.name.split(' ')[0]}!</h2>
                    <p className="text-gray-300 mb-6 max-w-xl">
                        {isAdmin 
                            ? "Manage your agency products, services, and view client orders." 
                            : "Manage your services, track orders, and request support."}
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setActiveTab('orders')} className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition">View Orders</button>
                        {!isAdmin && (
                             <button onClick={() => setActiveTab('support')} className="bg-transparent border border-white text-white px-4 py-2 rounded text-sm font-medium hover:bg-white/10 transition flex items-center gap-2">
                                <MessageSquare size={16}/> Get Support
                             </button>
                        )}
                        {isAdmin && (
                            <button onClick={() => setActiveTab('users')} className="bg-transparent border border-white text-white px-4 py-2 rounded text-sm font-medium hover:bg-white/10 transition">
                                Manage Users
                            </button>
                        )}
                    </div>
                    </div>

                    {/* Services Section */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{isAdmin ? "Manage Services" : "Available Services"}</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                {isAdmin ? "Add, edit, or remove services offered." : "Browse and purchase services."}
                            </p>
                        </div>
                        {isAdmin && (
                            <Button onClick={() => { setIsAddingService(true); setEditingService(null); }} className="flex items-center space-x-2">
                                <Plus size={16}/>
                                <span>Add Service</span>
                            </Button>
                        )}
                    </div>

                    {isAddingService && <ServiceUpsertForm />}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {services.map((service) => (
                            <ServiceCard 
                                key={service.id} 
                                service={service} 
                                isAdmin={isAdmin}
                                onDelete={deleteService}
                                onBuy={initServicePayment}
                                onEdit={(s) => { setEditingService(s); setIsAddingService(true); }}
                            />
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'orders' && <OrdersList />}
            
            {activeTab === 'users' && isAdmin && <UserManagement />}
            
            {activeTab === 'invoices' && <InvoiceManagement />}

            {activeTab === 'support' && <SupportSystem />}

            {activeTab === 'cms' && isAdmin && <CMSView />}

            {activeTab === 'settings' && isAdmin && <SettingsView />}

            {activeTab === 'testimonials' && isAdmin && <TestimonialsManager />}
            
            {activeTab === 'portfolio' && isAdmin && <PortfolioManager />}

         </div>
      </main>
    </div>
  );
};

export default ClientPortal;