'use server';

import { supabaseServer } from '../../lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function getFlowers() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('flower_types')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching flowers:', error);
    return [];
  }
  return data;
}

export async function createFlower(formData: FormData) {
  const name = formData.get('name') as string;
  const unit = formData.get('unit') as string;
  const defaultRate = parseFloat(formData.get('default_rate') as string);
  const status = formData.get('status') as string;

  const sb = supabaseServer();
  const { error } = await sb.from('flower_types').insert({
    name,
    unit,
    default_rate: defaultRate,
    status,
  });

  if (error) {
    console.error('Error creating flower type:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/flowers');
  return { success: true };
}

export async function updateFlower(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const unit = formData.get('unit') as string;
  const defaultRate = parseFloat(formData.get('default_rate') as string);
  const status = formData.get('status') as string;

  const sb = supabaseServer();
  const { error } = await sb
    .from('flower_types')
    .update({
      name,
      unit,
      default_rate: defaultRate,
      status,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating flower type:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/flowers');
  return { success: true };
}

export async function deleteFlower(id: string) {
  const sb = supabaseServer();
  const { error } = await sb.from('flower_types').delete().eq('id', id);

  if (error) {
    console.error('Error deleting flower type:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/flowers');
  return { success: true };
}
