import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { createProduct, updateProduct } from '../features/product/productSlice';

const schema = z.object({
  name: z.string().min(1),
  quantity: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
});

type FormData = z.infer<typeof schema>;

export default function ProductForm({
  initialValues,
  onSuccess,
}: {
  initialValues?: FormData & { id?: number };
  onSuccess: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data: FormData) => {
    if (initialValues?.id) {
      await dispatch(updateProduct({ ...data, id: initialValues.id }));
    } else {
      await dispatch(createProduct(data));
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-white p-4 rounded shadow-md">
      <input {...register('name')} placeholder="Name" className="w-full p-2 border" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <input {...register('quantity')} type="number" placeholder="Quantity" className="w-full p-2 border" />
      {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}

      <input {...register('price')} type="number" placeholder="Price" className="w-full p-2 border" />
      {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {initialValues?.id ? 'Update' : 'Create'} Product
      </button>
    </form>
  );
}
