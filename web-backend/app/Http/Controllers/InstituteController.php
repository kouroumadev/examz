<?php

namespace App\Http\Controllers;

use App\Models\Institute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InstituteController extends Controller
{
    public function index(Request $request)
    {
        $query = Institute::query();

        if ($search = $request->input('search')) {
            $query->whereRaw("name LIKE '%" .  $search . "%'")
                ->orWhereRaw("state LIKE '%" .  $search . "%'")
                ->orWhereRaw("city LIKE '%" .  $search . "%'")
                ->orWhereRaw("establishment_year LIKE '%" .  $search . "%'");
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->select('id', 'name', 'state', 'city', 'establishment_year')
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function all()
    {
        $data = Institute::select('id', 'name')->get();

        return $this->responseSuccess('Data', $data);
    }

    public function show(Request $request, $id)
    {
        $data = Institute::select('id', 'name', 'address', 'state', 'city', 'establishment_year', 'pin_code')
                            ->where('id', $id)
                            ->with(['branches' => function($q) use ($request) {
                                if ($search = $request->input('search')) {
                                    $q->whereRaw("name LIKE '%" .  $search . "%'")
                                        ->orWhereRaw("address LIKE '%" .  $search . "%'")
                                        ->orWhereRaw("state LIKE '%" .  $search . "%'")
                                        ->orWhereRaw("city LIKE '%" .  $search . "%'")
                                        ->orWhereRaw("status LIKE '%" .  $search . "%'");
                                }
                                $q->select('id', 'institute_id', 'name', 'address', 'state', 'city', 'status'); // ->where('name', 'Unesa')
                            }])
                            ->first();

        if (!$data) return $this->responseFailed('Institute not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string',
            'address' => 'required|string',
            'state' => 'required|string',
            'city' => 'required|string',
            'establishment_year' => 'required|string',
            'pin_code' => 'required|string|min:6|max:6',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $data = Institute::create($validator->validated());

        return $this->responseSuccess('Institute successfully created', $data, 201);
    }

    public function update(Request $request, $id)
    {
        $institute = Institute::where('id', $id)->first();
        if (!$institute) return $this->responseFailed('Institute not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string',
            'address' => 'required|string',
            'state' => 'required|string',
            'city' => 'required|string',
            'establishment_year' => 'required|string',
            'pin_code' => 'required|string|min:6|max:6',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $institute->update($validator->validated());

        $data = Institute::find($id);

        return $this->responseSuccess('Institute successfully updated', $data, 200);
    }

    public function destroy($id)
    {
        $institute = Institute::where('id', $id)->first();
        if (!$institute) return $this->responseFailed('Institute not found', '', 404);

        $institute->delete();

        return $this->responseSuccess('Institute successfully deleted');
    }
}
