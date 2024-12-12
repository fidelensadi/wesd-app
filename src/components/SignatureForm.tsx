import React from 'react';
import { FileSignature } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

interface SignatureFormProps {
  onSubmit: (data: FormData) => void;
  signature: string | null;
  onSignatureClick: () => void;
}

export const SignatureForm: React.FC<SignatureFormProps> = ({
  onSubmit,
  signature,
  onSignatureClick,
}) => {
  const [formData, setFormData] = React.useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Informations du signataire</h2>
          <p className="mt-2 text-sm text-gray-600">
            Veuillez remplir vos informations avant de signer le document
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Entreprise
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center space-y-4">
            {signature ? (
              <div className="w-64 h-32 border border-gray-200 rounded-xl p-2 relative group">
                <img
                  src={signature}
                  alt="Signature"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={onSignatureClick}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
                >
                  Modifier la signature
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onSignatureClick}
                className="flex items-center justify-center w-64 h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors"
              >
                <div className="text-center">
                  <FileSignature className="w-8 h-8 mx-auto text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-600">
                    Ajouter une signature
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!signature}
          className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuer
        </button>
      </form>
    </div>
  );
};